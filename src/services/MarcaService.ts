import { Op } from "sequelize";
import { Loja, Marca, Produto, Usuario, Venda, VendaDetalhe } from "../database/models";
import { ApiError } from "../utils/apiError";
import { buildPageInfo } from "../utils/pagination";
import { parseDateBr, resolvePeriodo } from "../utils/date";

class MarcaService {
  async get() {
    return Marca.findAll({ include: [{ model: Produto, as: "produtos" }], order: [["nome", "ASC"]] });
  }

  async getBrandsInsights(startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const inicio = startDate ? parseDateBr(startDate) : undefined;
    const fim = endDate ? parseDateBr(endDate) : undefined;

    const { rows: marcas, count: dataTotal } = await Marca.findAndCountAll({
      include: [
        {
          model: Produto,
          as: "produtos",
          required: false,
          include: [
            {
              model: VendaDetalhe,
              as: "venda_detalhe",
              required: false,
              attributes: ["quantidade"],
              include: [
                {
                  model: Venda,
                  as: "venda",
                  attributes: [],
                  where: inicio && fim ? { data_venda: { [Op.gte]: inicio, [Op.lte]: fim }, situacao: true } : { situacao: true },
                },
              ],
            },
          ],
        },
      ],
      offset: pagina * quantidade,
      limit: quantidade,
      distinct: true,
    });

    const result = marcas.map((marca) => {
      const produtos = (marca.get("produtos") as any[]) ?? [];
      const total_vendas = produtos.reduce((total, produto) => {
        const detalhes = produto.venda_detalhe ?? [];
        return total + detalhes.reduce((soma: number, vd: any) => soma + vd.quantidade, 0);
      }, 0);
      return { id: marca.id, nome: marca.nome, total_vendas };
    });

    return { result, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getById(id: number) {
    const marca = await Marca.findByPk(id, { include: [{ model: Produto, as: "produtos" }] });
    if (!marca) throw ApiError.notFound("Marca nao encontrada.");
    return marca;
  }

  async create(nome: string, cor: string) {
    return Marca.create({ nome, cor });
  }

  async associationProdutos(marcaID: number, produtoIds: number[]) {
    const marca = await Marca.findByPk(marcaID);
    if (!marca) throw ApiError.badRequest("A marca fornecida nao existe.");

    const produtos = await Produto.findAll({ where: { id: { [Op.in]: produtoIds } } });
    if (produtos.length !== produtoIds.length) {
      throw ApiError.badRequest("Alguns produtos fornecidos sao invalidos.");
    }

    const comOutraMarca = produtos.filter((p) => p.id_marca && p.id_marca !== marcaID);
    if (comOutraMarca.length > 0) {
      throw ApiError.conflict(
        `Os seguintes produtos ja estao associados a outra marca: ${comOutraMarca.map((p) => p.id).join(", ")}`
      );
    }

    await Produto.update({ id_marca: marcaID }, { where: { id: { [Op.in]: produtoIds } } });
    return this.getById(marcaID);
  }

  async update(id: number, nome: string, cor: string) {
    const marca = await this.getById(id);
    await marca.update({ nome, cor });
    return marca;
  }

  async delete(id: number) {
    const marca = await this.getById(id);
    await marca.destroy();
    return { message: "Marca removida com sucesso." };
  }

  async getBrandSalesById(marcaId: number, startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const { inicio, fim } = resolvePeriodo(startDate, endDate);
    const marcaInfo = await Marca.findByPk(marcaId, { attributes: ["id", "nome"] });
    if (!marcaInfo) throw ApiError.notFound("Marca nao encontrada");

    const whereVenda = { situacao: true, data_venda: { [Op.gte]: inicio, [Op.lte]: fim } };

    const vendas = await Venda.findAll({
      where: whereVenda,
      include: [
        {
          model: VendaDetalhe,
          as: "venda_detalhe",
          required: true,
          include: [{ model: Produto, as: "produto", required: true, where: { id_marca: marcaId }, attributes: ["nome"] }],
        },
      ],
    });

    const dataTotal = await Venda.count({ where: whereVenda });

    let pontos_totais = 0;
    let pontos_totais_tratamento = 0;
    let pontos_totais_coloracao = 0;
    const lojasMap = new Map<number, any>();
    const vendedoresMap = new Map<number, any>();

    for (const venda of vendas) {
      const detalhes = (venda.get("venda_detalhe") as any[]) ?? [];
      let totalVendaMarca = 0;
      let tratamentoVenda = 0;
      let coloracaoVenda = 0;

      for (const detalhe of detalhes) {
        const qtd = Number(detalhe.quantidade ?? 0);
        const nomeProd = String(detalhe.produto?.nome ?? "").toUpperCase();
        if (nomeProd.startsWith("T ")) tratamentoVenda += qtd;
        if (nomeProd.startsWith("C ")) coloracaoVenda += qtd;
        totalVendaMarca += qtd;
      }

      pontos_totais += totalVendaMarca;
      pontos_totais_tratamento += tratamentoVenda;
      pontos_totais_coloracao += coloracaoVenda;

      if (venda.loja_id) {
        const current = lojasMap.get(venda.loja_id) ?? { pontos_totais: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 };
        lojasMap.set(venda.loja_id, {
          pontos_totais: current.pontos_totais + totalVendaMarca,
          pontos_totais_tratamento: current.pontos_totais_tratamento + tratamentoVenda,
          pontos_totais_coloracao: current.pontos_totais_coloracao + coloracaoVenda,
        });
      }
      const current = vendedoresMap.get(venda.funcionario_id) ?? { quantidade: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 };
      vendedoresMap.set(venda.funcionario_id, {
        quantidade: current.quantidade + totalVendaMarca,
        pontos_totais_tratamento: current.pontos_totais_tratamento + tratamentoVenda,
        pontos_totais_coloracao: current.pontos_totais_coloracao + coloracaoVenda,
      });
    }

    const [lojasDb, usuariosDb] = await Promise.all([
      Loja.findAll({ where: { id: { [Op.in]: Array.from(lojasMap.keys()) } }, attributes: ["id", "nome_fantasia"] }),
      Usuario.findAll({ where: { id: { [Op.in]: Array.from(vendedoresMap.keys()) } }, attributes: ["id", "nome"] }),
    ]);

    const lojasFinal = lojasDb
      .map((l) => ({ ...lojasMap.get(l.id), nome_fantasia: l.nome_fantasia }))
      .sort((a, b) => b.pontos_totais - a.pontos_totais);
    const vendedoresFinal = usuariosDb
      .map((u) => ({ ...vendedoresMap.get(u.id), nome: u.nome }))
      .sort((a, b) => b.quantidade - a.quantidade);

    return {
      result: {
        id: marcaInfo.id,
        nome: marcaInfo.nome,
        pontos_totais,
        pontos_totais_coloracao,
        pontos_totais_tratamento,
        lojas: lojasFinal,
        vendedores: vendedoresFinal,
      },
      pageInfo: buildPageInfo(dataTotal, pagina, quantidade),
    };
  }
}

export default new MarcaService();
