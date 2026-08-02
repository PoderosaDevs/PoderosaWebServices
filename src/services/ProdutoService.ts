import { Op, WhereOptions } from "sequelize";
import { Categoria, Marca, Produto } from "../database/models";
import { ApiError } from "../utils/apiError";
import { buildPageInfo, parsePagination } from "../utils/pagination";

interface ProdutoInput {
  codigo: string;
  nome: string;
  descricao?: string;
  id_marca?: number;
  preco?: number;
  pontos?: number;
  situacao: boolean;
  imagem?: string;
  categorias?: { nome: string }[];
}

interface ProdutoFiltros {
  nome?: string;
  marca?: string;
  categorias?: string[];
  pontos_min?: number;
  pontos_max?: number;
}

class ProdutoService {
  async get(filtros: ProdutoFiltros, pagination?: { pagina?: number; quantidade?: number }) {
    const { pagina, quantidade } = parsePagination(pagination ?? {});

    const where: WhereOptions = {
      ...(filtros.nome ? { nome: { [Op.iLike]: `%${filtros.nome}%` } } : {}),
      ...(filtros.pontos_min !== undefined ? { pontos: { [Op.gte]: filtros.pontos_min } } : {}),
      ...(filtros.pontos_max !== undefined ? { pontos: { [Op.lte]: filtros.pontos_max } } : {}),
    };

    const include: any[] = [
      {
        model: Marca,
        as: "marca",
        required: Boolean(filtros.marca),
        ...(filtros.marca ? { where: { nome: filtros.marca } } : {}),
      },
      {
        model: Categoria,
        as: "categorias",
        required: Boolean(filtros.categorias?.length),
        ...(filtros.categorias?.length ? { where: { nome: { [Op.in]: filtros.categorias } } } : {}),
      },
    ];

    // Resolve primeiro os IDs (distintos) que batem com os filtros, incluindo
    // os joins obrigatorios (marca/categorias) - evita produtos duplicados
    // quando um produto casa com mais de uma categoria filtrada.
    const idsCorrespondentes = await Produto.findAll({
      where,
      include,
      attributes: ["id"],
      order: [["nome", "ASC"]],
    });
    const idsUnicos = Array.from(new Set(idsCorrespondentes.map((p) => p.id)));
    const dataTotal = idsUnicos.length;
    const idsPagina = idsUnicos.slice(pagina * quantidade, pagina * quantidade + quantidade);

    const produtos = idsPagina.length
      ? await Produto.findAll({
          where: { id: { [Op.in]: idsPagina } },
          include: [
            { model: Marca, as: "marca" },
            { model: Categoria, as: "categorias" },
          ],
          order: [["nome", "ASC"]],
        })
      : [];

    return { result: produtos, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getByID(id: number) {
    const produto = await Produto.findByPk(id, {
      include: [
        { model: Marca, as: "marca" },
        { model: Categoria, as: "categorias" },
      ],
    });
    if (!produto) throw ApiError.notFound("Produto nao encontrado.");
    return produto;
  }

  async create(data: ProdutoInput) {
    if (data.id_marca) {
      const marca = await Marca.findByPk(data.id_marca);
      if (!marca) throw ApiError.badRequest("A marca fornecida nao existe.");
    }

    let categorias: Categoria[] = [];
    if (data.categorias?.length) {
      categorias = await Categoria.findAll({ where: { nome: { [Op.in]: data.categorias.map((c) => c.nome) } } });
      if (categorias.length !== data.categorias.length) {
        throw ApiError.badRequest("Algumas categorias fornecidas sao invalidas.");
      }
    }

    const produto = await Produto.create({
      codigo: data.codigo,
      nome: data.nome,
      descricao: data.descricao ?? null,
      id_marca: data.id_marca ?? null,
      preco: data.preco ?? null,
      pontos: data.pontos ?? null,
      situacao: data.situacao,
      imagem: data.imagem ?? null,
    });

    if (categorias.length) {
      await (produto as any).setCategorias(categorias);
    }

    return this.getByID(produto.id);
  }

  async update(id: number, data: Partial<ProdutoInput>) {
    const produto = await this.getByID(id);

    if (data.id_marca) {
      const marca = await Marca.findByPk(data.id_marca);
      if (!marca) throw ApiError.badRequest("A marca fornecida nao existe.");
    }

    await produto.update({
      codigo: data.codigo ?? produto.codigo,
      nome: data.nome ?? produto.nome,
      descricao: data.descricao ?? produto.descricao,
      id_marca: data.id_marca ?? produto.id_marca,
      preco: data.preco ?? produto.preco,
      pontos: data.pontos ?? produto.pontos,
      situacao: data.situacao ?? produto.situacao,
      imagem: data.imagem ?? produto.imagem,
    });

    if (data.categorias) {
      const categorias = await Categoria.findAll({
        where: { nome: { [Op.in]: data.categorias.map((c) => c.nome) } },
      });
      if (categorias.length !== data.categorias.length) {
        throw ApiError.badRequest("Algumas categorias fornecidas sao invalidas.");
      }
      await (produto as any).setCategorias(categorias);
    }

    return this.getByID(id);
  }

  async delete(id: number) {
    const produto = await this.getByID(id);
    await produto.destroy();
    return { message: "Produto removido com sucesso." };
  }
}

export default new ProdutoService();
