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
    tipo_sistema?: string,
    marca?: string,
    categorias?: string[],
    pagination?: Pagination
  ): Promise<ProdutoResult> {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }

    let tipoSistemaId: number | undefined;
    if (tipo_sistema) {
      const tipoSistema = await prisma.tipo_sistema.findUnique({
        where: { nome: tipo_sistema },
      });

      if (!tipoSistema) {
        throw new Error(`Tipo de sistema '${tipo_sistema}' não encontrado.`);
      }

      tipoSistemaId = tipoSistema.id;
    }

    const filters: Prisma.produtoWhereInput = {
      ...(tipoSistemaId ? { id_tipo_sistema: tipoSistemaId } : {}),
      ...(marca ? { marca: { nome: marca } } : {}),
      ...(categorias && categorias.length > 0
        ? { categorias: { some: { nome: { in: categorias } } } }
        : {}),
    };

    // Realizar a consulta com os filtros aplicados
    const produtos = await prisma.produto.findMany({
      where: filters,
      include: {
        marca: true,
        categorias: true,
        tipo_sistema: true,
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
      estoque: produto.estoque ?? 0, // Garantir que não seja null
      id_fornecedor: produto.id_fornecedor ?? undefined, // Permitir undefined
      id_marca: produto.id_marca ?? undefined, // Permitir undefined
      preco: produto.preco ?? undefined, // Permitir undefined
      pontos: produto.pontos ?? 0, // Garantir que não seja null
      formato: produto.formato ?? undefined, // Permitir undefined
      data_expiracao: produto.data_expiracao ?? undefined, // Permitir undefined
      is_frete_gratis: produto.is_frete_gratis ?? false, // Garantir que não seja null
      peso_liquido: produto.peso_liquido ?? undefined, // Permitir undefined
      peso_bruto: produto.peso_bruto ?? undefined, // Permitir undefined
      largura: produto.largura ?? undefined, // Permitir undefined
      altura: produto.altura ?? undefined, // Permitir undefined
      profundidade: produto.profundidade ?? undefined, // Permitir undefined
      volumes: produto.volumes ?? undefined, // Permitir undefined
      itens_por_caixa: produto.itens_por_caixa ?? undefined, // Permitir undefined
      unidade_de_medida: produto.unidade_de_medida ?? undefined, // Permitir undefined
      situacao: produto.situacao ?? false, // Garantir que não seja null
      imagem: produto.imagem ?? undefined, // Permitir undefined
      categorias: produto.categorias ?? [], // Garantir que não seja null
      marca: produto.marca ?? undefined, // Permitir undefined
      tipo_sistema: produto.tipo_sistema ?? undefined, // Permitir undefined
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
    // Verifica se o tipo de sistema fornecido é válido
    const tipoSistema = await prisma.tipo_sistema.findUnique({
      where: {
        nome: data.tipo_sistemas_nomes, // Considerando que `data.tipo_sistemas_nomes` é a string com o nome do sistema
      },
    });

    if (!tipoSistema) {
      throw new GraphQLError(
        `O tipo de sistema fornecido (${data.tipo_sistemas_nomes}) é inválido.`
      );
    }

    // Busca os IDs das categorias fornecidas pelos nomes
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
        estoque: data.estoque,
        id_fornecedor: data.id_fornecedor,
        id_marca: data.id_marca,
        preco: data.preco,
        pontos: data.pontos,
        formato: data.formato,
        data_expiracao: data.data_expiracao,
        is_frete_gratis: data.is_frete_gratis,
        peso_liquido: data.peso_liquido,
        peso_bruto: data.peso_bruto,
        largura: data.largura,
        altura: data.altura,
        profundidade: data.profundidade,
        volumes: data.volumes,
        itens_por_caixa: data.itens_por_caixa,
        unidade_de_medida: data.unidade_de_medida,
        situacao: data.situacao,
        imagem: data.imagem,
        id_tipo_sistema: tipoSistema.id, // Associa o ID do tipo de sistema
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
