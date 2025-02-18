import { PrismaClient } from "@prisma/client";
import { LinhaCreateInput, LinhaUpdateInput } from "../inputs/Linha";
import { GraphQLError } from "graphql";
import { Pagination } from "../inputs/Utils";
import { LinhaResult } from "../models/Linha";
import getPageInfo from "../helpers/getPageInfo";

const prisma = new PrismaClient();

class LinhaServices {
  // Obter todas as linhas
  async get(pagination?: Pagination): Promise<LinhaResult> {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }

    const linhas = await prisma.linha.findMany({
      include: {
        produtos: true,
        marca: true,
      },
      skip: pagina * quantidade,
      take: quantidade,
    });

    if (linhas.length === 0) {
      throw new Error(`Nenhum produto encontrado para os filtros aplicados.`);
    }

    const dataTotal = await prisma.produto.count();

    const DataPageInfo = getPageInfo(dataTotal, pagina, quantidade);

    return { result: linhas, pageInfo: DataPageInfo };
  }

  // Obter uma linha por ID
  async getById(id: number) {
    const linha = await prisma.linha.findUnique({
      where: { id },
      include: {
        produtos: true,
        marca: true,
      },
    });

    if (!linha) {
      throw new Error(`Linha com ID ${id} não encontrada.`);
    }

    return linha;
  }

  // Criar uma nova linha
  async create(data: LinhaCreateInput) {
    const produtosIds = data.produtosIds || [];

    const linha = await prisma.linha.create({
      data: {
        nome: data.nome,
        marcaId: data.marcaId,
        produtos: {
          connect: produtosIds.map((id) => ({ id })),
        },
      },
    });

    return linha;
  }

  // Atualizar o nome de uma linha existente
  async update(input: LinhaUpdateInput) {
    const { id, nome } = input;

    const linha = await prisma.linha.update({
      where: { id },
      data: { nome },
    });

    return linha;
  }

  // Excluir uma linha por ID
  async delete(id: number) {
    const linha = await prisma.linha.delete({
      where: { id },
    });

    return linha;
  }
}

export default new LinhaServices();
