// src/services/ProdutoService.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { ProdutoInput } from "../inputs/Produto";
import { prisma } from "../database";
import { GraphQLError } from "graphql";
import { Pagination } from "../inputs/Utils";
import { ProdutoModel, ProdutoResult } from "../models/Produto";
import getPageInfo from "../helpers/getPageInfo";

class ProdutoService {
  async get(
    nome?: string,
    marca?: string,
    categorias?: string[],
    pontos_min?: number,
    pontos_max?: number,
    pagination?: Pagination
  ): Promise<ProdutoResult> {
    let pagina: number = 0;
    let quantidade: number = 10;
  
    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }
  
    const filters: Prisma.produtoWhereInput = {
      ...(nome ? { nome: { contains: nome, mode: "insensitive" } } : {}),
      ...(marca ? { marca: { nome: marca } } : {}),
      ...(categorias && categorias.length > 0
        ? { categorias: { some: { nome: { in: categorias } } } }
        : {}),
      ...(pontos_min !== undefined ? { pontos: { gte: pontos_min } } : {}),
      ...(pontos_max !== undefined ? { pontos: { lte: pontos_max } } : {}),
    };
  
    // Realizar a consulta com os filtros aplicados
    const produtos = await prisma.produto.findMany({
      where: filters,
      include: {
        marca: true,
        categorias: true,
      },
      skip: pagina * quantidade,
      take: quantidade,
    });
  
    if (produtos.length === 0) {
      throw new Error(`Nenhum produto encontrado para os filtros aplicados.`);
    }
  
    const dataTotal = await prisma.produto.count({
      where: filters,
    });
  
    const DataPageInfo = getPageInfo(dataTotal, pagina, quantidade);
  
    const produtosCorretos: ProdutoModel[] = produtos.map((produto) => ({
      id: produto.id,
      codigo: produto.codigo,
      nome: produto.nome,
      descricao: produto.descricao ?? '', // Garantir que não seja null
      id_marca: produto.id_marca ?? undefined, // Permitir undefined
      preco: produto.preco ?? undefined, // Permitir undefined
      pontos: produto.pontos ?? 0, // Garantir que não seja null
      situacao: produto.situacao ?? false, // Garantir que não seja null
      imagem: produto.imagem ?? undefined, // Permitir undefined
      categorias: produto.categorias ?? [], // Garantir que não seja null
      marca: produto.marca ?? undefined, // Permitir undefined
    }));
  
    return { result: produtosCorretos, pageInfo: DataPageInfo };
  }

  async getByID(id: number) {
    return prisma.produto.findUnique({
      where: { id },
      include: {
        marca: true,
        categorias: true,
      },
    });
  }

  async create(data: ProdutoInput) {

    const categorias = await prisma.categoria.findMany({
      where: {
        nome: {
          in: data.categorias?.map((categoria) => categoria.nome) || [],
        },
      },
    });

    if (categorias.length !== (data.categorias?.length || 0)) {
      throw new GraphQLError("Algumas categorias fornecidas são inválidas.");
    }

    const categoriaIds = categorias.map((categoria) => categoria.id);

    // Cria o produto associando-o ao tipo de sistema e às categorias
    const produto = await prisma.produto.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao,
        id_marca: data.id_marca,
        preco: data.preco,
        pontos: data.pontos,
        situacao: data.situacao,
        imagem: data.imagem,
        categorias: {
          connect: categoriaIds.map((id) => ({ id })),
        },
      },
    });

    return produto;
  }

  // async update(id: string, data: ProdutoInput) {
  //   const produto = await prisma.produto.update({
  //     where: { id },
  //     data: {
  //       ...data,
  //     },
  //   });

  //   return produto

  // }

  async delete(id: number) {
    try {
      await prisma.produto.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      return false;
    }
  }
}

export default new ProdutoService();
