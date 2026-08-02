import { Op } from "sequelize";
import { Linha, Marca, Produto } from "../database/models";
import { ApiError } from "../utils/apiError";
import { buildPageInfo, parsePagination } from "../utils/pagination";

interface LinhaCreateInput {
  nome: string;
  marcaId: number;
  produtosIds?: number[];
}

class LinhaService {
  async get(pagination?: { pagina?: number; quantidade?: number }) {
    const { pagina, quantidade } = parsePagination(pagination ?? {});

    const { rows: linhas, count: dataTotal } = await Linha.findAndCountAll({
      include: [
        { model: Produto, as: "produtos" },
        { model: Marca, as: "marca" },
      ],
      offset: pagina * quantidade,
      limit: quantidade,
      distinct: true,
    });

    return { result: linhas, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getById(id: number) {
    const linha = await Linha.findByPk(id, {
      include: [
        { model: Produto, as: "produtos" },
        { model: Marca, as: "marca" },
      ],
    });
    if (!linha) throw ApiError.notFound(`Linha com ID ${id} nao encontrada.`);
    return linha;
  }

  async create(data: LinhaCreateInput) {
    const linha = await Linha.create({ nome: data.nome, marcaId: data.marcaId });

    if (data.produtosIds?.length) {
      const produtos = await Produto.findAll({ where: { id: { [Op.in]: data.produtosIds } } });
      await (linha as any).setProdutos(produtos);
    }

    return this.getById(linha.id);
  }

  async update(id: number, nome: string) {
    const linha = await this.getById(id);
    await linha.update({ nome });
    return linha;
  }

  async delete(id: number) {
    const linha = await this.getById(id);
    await linha.destroy();
    return { message: "Linha removida com sucesso." };
  }
}

export default new LinhaService();
