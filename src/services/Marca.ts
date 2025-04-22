// marcaService.ts

import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import getPageInfo from "../helpers/getPageInfo";
import { BrandInsightsResponse } from "../models/Marca";
import { endOfMonth, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

class MarcaServices {
  async get() {
    return prisma.marca.findMany({
      include: {
        produtos: true,  // Inclui os produtos associados à marca
      },
    });
  }

  async getBrandsInsights(
    startDate?: Date,
    endDate?: Date,
    pagina: number = 0,
    quantidade: number = 10
  ): Promise<BrandInsightsResponse> {
    const inicio = startDate || startOfMonth(new Date());
    const fim = endDate || endOfMonth(new Date());
  
    const marcas = await prisma.marca.findMany({
      select: {
        id: true,
        nome: true,
        produtos: {
          select: {
            venda_detalhe: {
              where: {
                venda: {
                  data_venda: {
                    gte: inicio,
                    lte: fim,
                  },
                  situacao: true,
                },
              },
              select: {
                quantidade: true,
              },
            },
          },
        },
      },
      skip: pagina * quantidade,
      take: quantidade,
    });
  
    const result = marcas.map((marca) => ({
      id: marca.id,
      nome: marca.nome,
      total_vendas: marca.produtos.reduce((total, produto) => {
        return total + produto.venda_detalhe.reduce((soma, vd) => soma + vd.quantidade, 0);
      }, 0),
    }));
  
    const dataTotal = await prisma.marca.count();
    const pageInfo = getPageInfo(dataTotal, pagina, quantidade);
  
    return { result, pageInfo };
  }
  
  
  async getById(id: number) {
    return prisma.marca.findUnique({ where: { id } });
  }

  async create(nome: string, cor: string) {
    return prisma.marca.create({ data: { nome, cor } });
  }

  async associationProdutos(marcaID: number, produtoIds: number[]) {
    // Verifica se a marca existe
    const marca = await prisma.marca.findUnique({
      where: { id: marcaID },
    });
  
    if (!marca) {
      throw new GraphQLError("A marca fornecida não existe.");
    }
  
    // Verifica se os produtos existem
    const produtosExistentes = await prisma.produto.findMany({
      where: { id: { in: produtoIds } },
      select: { id: true, id_marca: true },
    });
  
    const produtosValidos = produtosExistentes.map((p) => p.id);
  
    // Se houver produtos inválidos, retorna erro
    if (produtosValidos.length !== produtoIds.length) {
      throw new GraphQLError("Alguns produtos fornecidos são inválidos.");
    }
  
    // Verifica se algum produto já está associado a outra marca
    const produtosComMarca = produtosExistentes.filter((p) => p.id_marca && p.id_marca !== marcaID);
    if (produtosComMarca.length > 0) {
      throw new GraphQLError(`Os seguintes produtos já estão associados a outra marca: ${produtosComMarca.map(p => p.id).join(", ")}`);
    }
  
    // Atualiza a marca associando os produtos
    const marcaAtualizada = await prisma.marca.update({
      where: { id: marcaID },
      data: {
        produtos: {
          connect: produtosValidos.map((id) => ({ id })),
        },
      },
      select: {
        id: true, // Retorna o ID da marca
        nome: true, // Retorna o nome ou outros campos relevantes
        // Adicione mais campos conforme necessário
      },
    });
  
    return marcaAtualizada;
  }
  

  async update(id: number, nome: string, cor: string) {
    return prisma.marca.update({
      where: { id },
      data: { nome, cor },
    });
  }

  async delete(id: number) {
    return prisma.marca.delete({ where: { id } });
  }
}


export default new MarcaServices()