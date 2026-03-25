// marcaService.ts

import { PrismaClient } from "@prisma/client";
import { GraphQLError } from "graphql";
import getPageInfo from "../helpers/getPageInfo";
import { BrandInsightsResponse } from "../models/Marca";
import { endOfDay, endOfMonth, parse, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

class MarcaServices {
  async get() {
    return prisma.marca.findMany({
      include: {
        produtos: true, // Inclui os produtos associados à marca
      },
    });
  }

  async getBrandsInsights(
    startDate?: string, // <- agora é string
    endDate?: string,
    pagina: number = 0,
    quantidade: number = 10
  ): Promise<BrandInsightsResponse> {
    const parseDate = (dateStr: string) =>
      parse(dateStr, "dd/MM/yyyy", new Date());

    const inicio = startDate ? parseDate(startDate) : startOfMonth(new Date());
    const fim = endDate ? parseDate(endDate) : endOfMonth(new Date());

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
        return (
          total +
          produto.venda_detalhe.reduce((soma, vd) => soma + vd.quantidade, 0)
        );
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
    const produtosComMarca = produtosExistentes.filter(
      (p) => p.id_marca && p.id_marca !== marcaID
    );
    if (produtosComMarca.length > 0) {
      throw new GraphQLError(
        `Os seguintes produtos já estão associados a outra marca: ${produtosComMarca
          .map((p) => p.id)
          .join(", ")}`
      );
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

async getBrandSalesById(
  marcaId: number,
  startDate?: string,
  endDate?: string,
  pagina: number = 0,
  quantidade: number = 10
) {
  const parseDate = (dateStr: string) => parse(dateStr, "dd/MM/yyyy", new Date());

  const inicio = startDate ? parseDate(startDate) : startOfMonth(new Date());
  const fim = endDate ? endOfDay(parseDate(endDate)) : endOfDay(endOfMonth(new Date()));

  const dataFilter = {
    situacao: true,
    data_venda: {
      gte: inicio,
      lte: fim,
    },
    venda_detalhe: {
      some: {
        produto: { id_marca: marcaId },
      },
    },
  };

  // 1. Busca global para TOTAIS e RANKINGS (Sem paginação)
  const todasVendasMarca = await prisma.venda.findMany({
    where: dataFilter,
    select: {
      loja_id: true,
      funcionario_id: true,
      venda_detalhe: {
        where: { produto: { id_marca: marcaId } },
        select: {
          quantidade: true,
          produto: { select: { nome: true } },
        },
      },
    },
  });

  // 2. Busca paginada apenas para a LISTA de vendas (Se necessário retornar lista)
  const vendasPaginadas = await prisma.venda.findMany({
    where: dataFilter,
    skip: pagina * quantidade,
    take: quantidade,
    orderBy: { data_venda: 'desc' }
  });

  const dataTotal = await prisma.venda.count({ where: dataFilter });
  const pageInfo = getPageInfo(dataTotal, pagina, quantidade);

  const marcaInfo = await prisma.marca.findUnique({
    where: { id: marcaId },
    select: { id: true, nome: true },
  });

  if (!marcaInfo) throw new Error("Marca não encontrada");

  let pontos_totais = 0;
  let pontos_totais_tratamento = 0;
  let pontos_totais_coloracao = 0;

  const lojasMap = new Map<number, any>();
  const vendedoresMap = new Map<number, any>();

  // 3. Processamento sobre TODAS as vendas do período
  for (const venda of todasVendasMarca) {
    let totalVendaMarca = 0;
    let tratamentoVenda = 0;
    let coloracaoVenda = 0;

    for (const detalhe of venda.venda_detalhe) {
      const qtd = Number(detalhe.quantidade ?? 0);
      const nomeProd = String(detalhe.produto?.nome ?? "").toUpperCase();
      
      const isTratamento = nomeProd.startsWith("T ");
      const isColoracao = nomeProd.startsWith("C ");

      totalVendaMarca += qtd;
      if (isTratamento) tratamentoVenda += qtd;
      if (isColoracao) coloracaoVenda += qtd;
    }

    pontos_totais += totalVendaMarca;
    pontos_totais_tratamento += tratamentoVenda;
    pontos_totais_coloracao += coloracaoVenda;

    // Agregação de Lojas
    if (venda.loja_id) {
      const current = lojasMap.get(venda.loja_id) || { pontos_totais: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 };
      lojasMap.set(venda.loja_id, {
        ...current,
        pontos_totais: current.pontos_totais + totalVendaMarca,
        pontos_totais_tratamento: current.pontos_totais_tratamento + tratamentoVenda,
        pontos_totais_coloracao: current.pontos_totais_coloracao + coloracaoVenda,
      });
    }

    // Agregação de Vendedores
    if (venda.funcionario_id) {
      const current = vendedoresMap.get(venda.funcionario_id) || { quantidade: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 };
      vendedoresMap.set(venda.funcionario_id, {
        ...current,
        quantidade: current.quantidade + totalVendaMarca,
        pontos_totais_tratamento: current.pontos_totais_tratamento + tratamentoVenda,
        pontos_totais_coloracao: current.pontos_totais_coloracao + coloracaoVenda,
      });
    }
  }

  // 4. Hidratação de nomes (Busca apenas os envolvidos)
  const [lojasDb, usuariosDb] = await Promise.all([
    prisma.loja.findMany({
      where: { id: { in: Array.from(lojasMap.keys()) } },
      select: { id: true, nome_fantasia: true }
    }),
    prisma.usuario.findMany({
      where: { id: { in: Array.from(vendedoresMap.keys()) } },
      select: { id: true, nome: true }
    })
  ]);

  const lojasFinal = lojasDb.map(l => ({
    ...lojasMap.get(l.id),
    nome_fantasia: l.nome_fantasia
  })).sort((a, b) => b.pontos_totais - a.pontos_totais);

  const vendedoresFinal = usuariosDb.map(u => ({
    ...vendedoresMap.get(u.id),
    nome: u.nome
  })).sort((a, b) => b.quantidade - a.quantidade);

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
    pageInfo,
  };
}
  
}

export default new MarcaServices();
