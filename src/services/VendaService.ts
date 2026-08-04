import { Op, Transaction } from "sequelize";
import { sequelize } from "../config/database";
import { Loja, Produto, Usuario, Venda, VendaDetalhe } from "../database/models";
import { ApiError } from "../utils/apiError";
import { buildPageInfo } from "../utils/pagination";
import { normalizarDataPara10h, parseDateBr } from "../utils/date";
import { TipoPessoa } from "../types/enums";

interface VendaDetalheInput {
  id?: number;
  produtoId: number;
  quantidade: number;
}

interface VendaInput {
  funcionarioId: number;
  lojaId: number;
  vendaDetalhes: VendaDetalheInput[];
  data_venda?: string | Date;
}

const includeCompleto = [
  { model: Usuario, as: "funcionario" },
  { model: Loja, as: "loja" },
  {
    model: VendaDetalhe,
    as: "venda_detalhe",
    include: [{ model: Produto, as: "produto" }],
  },
];

class VendaService {
  async get(startDate?: Date, endDate?: Date) {
    const where: Record<string, unknown> = {};
    if (startDate && endDate) {
      where.data_venda = { [Op.gte]: startDate, [Op.lte]: endDate };
    } else if (startDate) {
      where.data_venda = startDate;
    }

    return Venda.findAll({ where, include: includeCompleto, order: [["data_venda", "DESC"]] });
  }

  async getStoresInsights(startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const inicio = startDate ? parseDateBr(startDate) : undefined;
    const fim = endDate ? parseDateBr(endDate) : undefined;

    const lojas = await Loja.findAll({
      include: [
        {
          model: Venda,
          as: "vendas",
          required: false,
          where: inicio && fim ? { data_venda: { [Op.gte]: inicio, [Op.lte]: fim } } : undefined,
          include: [{ model: VendaDetalhe, as: "venda_detalhe", attributes: ["quantidade"] }],
        },
      ],
    });

    const resultOrdenado = lojas
      .map((loja) => {
        const vendas = (loja.get("vendas") as any[]) ?? [];
        const total_vendas = vendas.reduce((total, venda) => {
          const detalhes = venda.venda_detalhe ?? [];
          return total + detalhes.reduce((soma: number, d: any) => soma + d.quantidade, 0);
        }, 0);
        return { id: loja.id, nome: loja.nome_fantasia, total_vendas };
      })
      .sort((a, b) => b.total_vendas - a.total_vendas)
      .slice(pagina * quantidade, pagina * quantidade + quantidade);

    return { result: resultOrdenado, pageInfo: buildPageInfo(lojas.length, pagina, quantidade) };
  }

  async getByID(id: number, transaction?: Transaction) {
    const venda = await Venda.findByPk(id, { include: includeCompleto, transaction });
    if (!venda) throw ApiError.notFound("Venda nao encontrada.");
    return venda;
  }

  async getByUserID(id: number, dataMensal?: string) {
    const where: Record<string, unknown> = { funcionario_id: id };

    if (dataMensal) {
      const [mes, ano] = dataMensal.split("/").map(Number);
      const anoCompleto = 2000 + ano;
      const inicio = new Date(anoCompleto, mes - 1, 1);
      const fim = new Date(anoCompleto, mes, 0, 23, 59, 59, 999);
      where.data_venda = { [Op.gte]: inicio, [Op.lte]: fim };
    }

    return Venda.findAll({ where, include: includeCompleto, order: [["data_venda", "DESC"]] });
  }

  async create(data: VendaInput) {
    return sequelize.transaction(async (t) => {
      const [funcionario, loja] = await Promise.all([
        Usuario.findByPk(data.funcionarioId, { transaction: t }),
        Loja.findByPk(data.lojaId, { transaction: t }),
      ]);

      if (!loja) throw ApiError.badRequest("Loja nao encontrada.");
      if (!funcionario) throw ApiError.badRequest("Funcionario nao encontrado.");
      if (funcionario.tipo_pessoa !== TipoPessoa.EMPLOYEE) {
        throw ApiError.badRequest("Usuario nao e um funcionario.");
      }

      const dataVenda = normalizarDataPara10h(data.data_venda ?? new Date());

      const vendaExistente = await Venda.findOne({
        where: { funcionario_id: data.funcionarioId, loja_id: data.lojaId, data_venda: dataVenda },
        transaction: t,
      });
      if (vendaExistente) {
        throw ApiError.conflict("Ja existe uma venda registrada nessa data para este funcionario e loja.");
      }

      let pontosTotais = 0;
      const detalhesParaCriar: { produto_id: number; quantidade: number; pontos: number }[] = [];

      for (const detalhe of data.vendaDetalhes) {
        const produto = await Produto.findByPk(detalhe.produtoId, { transaction: t });
        if (!produto) {
          throw ApiError.badRequest(`Produto com ID ${detalhe.produtoId} nao encontrado.`);
        }
        const pontos = (produto.pontos ?? 0) * (detalhe.quantidade ?? 0);
        pontosTotais += pontos;
        detalhesParaCriar.push({ produto_id: detalhe.produtoId, quantidade: detalhe.quantidade ?? 0, pontos });
      }

      const venda = await Venda.create(
        {
          funcionario_id: data.funcionarioId,
          loja_id: data.lojaId,
          data_venda: dataVenda,
          pontos_totais: pontosTotais,
          situacao: true,
        },
        { transaction: t }
      );

      await VendaDetalhe.bulkCreate(
        detalhesParaCriar.map((d) => ({ ...d, venda_id: venda.id })),
        { transaction: t }
      );

      return this.getByID(venda.id, t);
    });
  }

  async update(id: number, data: Partial<VendaInput>) {
    return sequelize.transaction(async (t) => {
      const venda = await Venda.findByPk(id, { include: [{ model: VendaDetalhe, as: "venda_detalhe" }], transaction: t });
      if (!venda) throw ApiError.notFound("Venda nao encontrada.");

      const detalhesExistentes = (venda.get("venda_detalhe") as VendaDetalhe[]) ?? [];
      const idsExistentes = new Set(detalhesExistentes.map((d) => d.id));
      const detalhesNovos = data.vendaDetalhes ?? [];
      const idsRecebidos = new Set(detalhesNovos.filter((d) => d.id).map((d) => d.id));

      const idsParaRemover = Array.from(idsExistentes).filter((id) => !idsRecebidos.has(id));
      if (idsParaRemover.length > 0) {
        await VendaDetalhe.destroy({ where: { id: { [Op.in]: idsParaRemover } }, transaction: t });
      }

      for (const detalhe of detalhesNovos) {
        if (detalhe.id && idsExistentes.has(detalhe.id)) {
          await VendaDetalhe.update(
            { produto_id: detalhe.produtoId, quantidade: detalhe.quantidade },
            { where: { id: detalhe.id }, transaction: t }
          );
        } else {
          await VendaDetalhe.create(
            { venda_id: id, produto_id: detalhe.produtoId, quantidade: detalhe.quantidade, pontos: 0 },
            { transaction: t }
          );
        }
      }

      if (data.data_venda) {
        await venda.update({ data_venda: normalizarDataPara10h(data.data_venda) }, { transaction: t });
      }

      const detalhesAtualizados = await VendaDetalhe.findAll({
        where: { venda_id: id },
        include: [{ model: Produto, as: "produto" }],
        transaction: t,
      });

      let pontosTotaisAtualizados = 0;
      for (const detalhe of detalhesAtualizados) {
        const produto = detalhe.get("produto") as Produto;
        const pontos = (produto?.pontos ?? 0) * (detalhe.quantidade ?? 0);
        pontosTotaisAtualizados += pontos;
        await detalhe.update({ pontos }, { transaction: t });
      }

      await venda.update({ pontos_totais: pontosTotaisAtualizados }, { transaction: t });

      return this.getByID(id, t);
    });
  }

  async delete(id: number) {
    return sequelize.transaction(async (t) => {
      const venda = await Venda.findByPk(id, { transaction: t });
      if (!venda) throw ApiError.notFound("Venda nao encontrada.");

      await VendaDetalhe.destroy({ where: { venda_id: id }, transaction: t });
      await venda.destroy({ transaction: t });
      return venda;
    });
  }
}

export default new VendaService();
