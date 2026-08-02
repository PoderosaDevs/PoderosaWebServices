import { Op } from "sequelize";
import { Loja, Marca, Produto, Usuario, Venda, VendaDetalhe } from "../database/models";
import { ApiError } from "../utils/apiError";
import { buildPageInfo, parsePagination } from "../utils/pagination";
import { resolvePeriodo } from "../utils/date";

class LojaService {
  async get(pagination?: { pagina?: number; quantidade?: number }) {
    const { pagina, quantidade } = parsePagination(pagination ?? {});

    const { rows: lojas, count: dataTotal } = await Loja.findAndCountAll({
      offset: pagina * quantidade,
      limit: quantidade,
      order: [["nome_fantasia", "ASC"]],
    });

    return { result: lojas, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getById(id: number) {
    const loja = await Loja.findByPk(id);
    if (!loja) throw ApiError.notFound("Loja nao encontrada.");
    return loja;
  }

  async create(data: { nome_fantasia: string; razao_social: string }) {
    return Loja.create(data);
  }

  async update(id: number, data: { nome_fantasia?: string; razao_social?: string }) {
    const loja = await this.getById(id);
    await loja.update(data);
    return loja;
  }

  async deleteLoja(id: number) {
    const loja = await this.getById(id);
    await loja.destroy();
    return { id };
  }

  async getRanking(startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const { inicio, fim } = resolvePeriodo(startDate, endDate);

    const { rows: lojas, count: dataTotal } = await Loja.findAndCountAll({
      include: [
        {
          model: Venda,
          as: "vendas",
          required: false,
          where: { situacao: true, data_venda: { [Op.gte]: inicio, [Op.lte]: fim } },
          include: [{ model: VendaDetalhe, as: "venda_detalhe", attributes: ["quantidade"] }],
        },
      ],
      offset: pagina * quantidade,
      limit: quantidade,
      distinct: true,
    });

    const result = lojas.map((loja) => {
      const vendas = (loja.get("vendas") as any[]) ?? [];
      const total_vendas = vendas.reduce((total, venda) => {
        const detalhes = venda.venda_detalhe ?? [];
        return total + detalhes.reduce((soma: number, vd: any) => soma + vd.quantidade, 0);
      }, 0);
      return { id: loja.id, nome_fantasia: loja.nome_fantasia, total_vendas };
    });

    result.sort((a, b) => b.total_vendas - a.total_vendas);

    return { result, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getStoreSalesById(lojaId: number, startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const { inicio, fim } = resolvePeriodo(startDate, endDate);
    const loja = await Loja.findByPk(lojaId, { attributes: ["id", "nome_fantasia", "razao_social"] });
    if (!loja) throw ApiError.notFound("Loja nao encontrada");

    const whereVenda = { loja_id: lojaId, situacao: true, data_venda: { [Op.gte]: inicio, [Op.lte]: fim } };

    const vendas = await Venda.findAll({
      where: whereVenda,
      include: [
        {
          model: VendaDetalhe,
          as: "venda_detalhe",
          include: [{ model: Produto, as: "produto", include: [{ model: Marca, as: "marca" }] }],
        },
      ],
    });

    const dataTotal = await Venda.count({ where: whereVenda });

    let pontos_totais = 0;
    let pontos_totais_tratamento = 0;
    let pontos_totais_coloracao = 0;
    const marcasMap = new Map<number, any>();
    const vendedoresMap = new Map<number, any>();

    const funcionarioIds = [...new Set(vendas.map((v) => v.funcionario_id))];
    const usuarios = await Usuario.findAll({ where: { id: { [Op.in]: funcionarioIds } }, attributes: ["id", "nome"] });
    usuarios.forEach((u) => {
      vendedoresMap.set(u.id, { nome: u.nome, quantidade: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 });
    });

    for (const venda of vendas) {
      let totalVenda = 0;
      let pTratVenda = 0;
      let pColVenda = 0;
      const detalhes = (venda.get("venda_detalhe") as any[]) ?? [];

      for (const det of detalhes) {
        const qtd = det.quantidade || 0;
        const nomeProd = (det.produto?.nome || "").toUpperCase();
        const isT = nomeProd.startsWith("T ");
        const isC = nomeProd.startsWith("C ");

        pontos_totais += qtd;
        totalVenda += qtd;
        if (isT) { pontos_totais_tratamento += qtd; pTratVenda += qtd; }
        else if (isC) { pontos_totais_coloracao += qtd; pColVenda += qtd; }

        const marca = det.produto?.marca;
        if (marca) {
          if (!marcasMap.has(marca.id)) {
            marcasMap.set(marca.id, { id: marca.id, nome: marca.nome, quantidade: 0, pontos_tratamento: 0, pontos_coloracao: 0 });
          }
          const m = marcasMap.get(marca.id);
          m.quantidade += qtd;
          if (isT) m.pontos_tratamento += qtd;
          if (isC) m.pontos_coloracao += qtd;
        }
      }

      const v = vendedoresMap.get(venda.funcionario_id);
      if (v) {
        v.quantidade += totalVenda;
        v.pontos_totais_tratamento += pTratVenda;
        v.pontos_totais_coloracao += pColVenda;
      }
    }

    return {
      result: {
        id: loja.id,
        nome_fantasia: loja.nome_fantasia,
        razao_social: loja.razao_social,
        pontos_totais,
        pontos_totais_coloracao,
        pontos_totais_tratamento,
        marcas: Array.from(marcasMap.values()).sort((a, b) => b.quantidade - a.quantidade),
        vendedores: Array.from(vendedoresMap.values()).sort((a, b) => b.quantidade - a.quantidade),
      },
      pageInfo: buildPageInfo(dataTotal, pagina, quantidade),
    };
  }
}

export default new LojaService();
