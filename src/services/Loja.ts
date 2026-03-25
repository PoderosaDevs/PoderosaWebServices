import { PrismaClient } from "@prisma/client";
import { Pagination } from "../inputs/Utils";
import { LojaResult } from "../models/Loja";
import getPageInfo from "../helpers/getPageInfo";
import { endOfDay, endOfMonth, parse, startOfDay, startOfMonth } from "date-fns";

const prisma = new PrismaClient();

class LojaService {
  async get(pagination?: Pagination): Promise<LojaResult> {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }

    // Mapeia os dados para o formato esperado pelo TypeGraphQL
    const lojas = await prisma.loja.findMany({
      skip: pagina * quantidade,
      take: quantidade,
    });

    if (lojas.length === 0) {
      throw new Error(`Nenhum produto encontrado para os filtros aplicados.`);
    }

    // Conta total de registros
    const dataTotal = await prisma.loja.count();

    // Prepara o PaginationInfo
    const DataPageInfo = getPageInfo(dataTotal, pagina, quantidade);

    return { result: lojas, pageInfo: DataPageInfo };
  }

  async getById(id: number) {
    return prisma.loja.findUnique({
      where: { id },
    });
  }

  async create(data: { nome_fantasia: string; razao_social: string }) {
    return prisma.loja.create({ data });
  }

  async update(data: {
    id: number;
    nome_fantasia?: string;
    razao_social?: string;
  }) {
    return prisma.loja.update({
      where: { id: data.id },
      data,
    });
  }

  async deleteLoja(id: number) {
    const { id: deletedId } = await prisma.loja.delete({
      where: { id },
      select: { id: true }, // devolve só o campo id
    });

    return deletedId; // → 123
  }

 async getStoreSalesById(
  lojaId: number,
  startDate?: string,
  endDate?: string,
  pagina: number = 0,
  quantidade: number = 10,
) {
  const parseDate = (dateStr: string) => parse(dateStr, "dd/MM/yyyy", new Date());

  const inicio = startDate ? startOfDay(parseDate(startDate)) : startOfMonth(new Date());
  const fim = endDate ? endOfDay(parseDate(endDate)) : endOfDay(endOfMonth(new Date()));

  const dataFilter = {
    data_venda: {
      gte: inicio,
      lte: fim,
    },
  };

  const whereClause = {
    loja_id: lojaId,
    situacao: true,
    ...dataFilter,
  };

  // 1. Busca TODAS as vendas do período para o consolidado (sem paginação aqui)
  // Nota: Em sistemas de altíssimo volume, usaríamos _sum ouGroupBy, 
  // mas para processar nomes (T e C), o loop é necessário.
  const todasVendasPeriodo = await prisma.venda.findMany({
    where: whereClause,
    select: {
      funcionario_id: true,
      venda_detalhe: {
        select: {
          quantidade: true,
          produto: {
            select: {
              nome: true,
              id_marca: true,
              marca: { select: { id: true, nome: true } },
            },
          },
        },
      },
    },
  });

  const dataTotal = todasVendasPeriodo.length;
  const pageInfo = getPageInfo(dataTotal, pagina, quantidade);

  const loja = await prisma.loja.findUnique({
    where: { id: lojaId },
    select: { id: true, nome_fantasia: true, razao_social: true },
  });

  if (!loja) throw new Error("Loja não encontrada");

  // Agregadores globais do período
  let pontos_totais = 0;
  let pontos_totais_tratamento = 0;
  let pontos_totais_coloracao = 0;

  const marcasMap = new Map<number, any>();
  const vendedoresMap = new Map<number, any>();

  // Pré-carregar nomes de funcionários únicos
  const funcionarioIds = [...new Set(todasVendasPeriodo.map(v => v.funcionario_id))];
  const usuarios = await prisma.usuario.findMany({
    where: { id: { in: funcionarioIds } },
    select: { id: true, nome: true },
  });

  usuarios.forEach(u => {
    vendedoresMap.set(u.id, { nome: u.nome, quantidade: 0, pontos_totais_tratamento: 0, pontos_totais_coloracao: 0 });
  });

  // 2. Processamento Consolidado
  for (const venda of todasVendasPeriodo) {
    let totalVenda = 0;
    let pTratVenda = 0;
    let pColVenda = 0;

    for (const det of venda.venda_detalhe) {
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

  const marcasFinal = Array.from(marcasMap.values()).sort((a, b) => b.quantidade - a.quantidade);
  const vendedoresFinal = Array.from(vendedoresMap.values()).sort((a, b) => b.quantidade - a.quantidade);

  return {
    result: {
      id: loja.id,
      nome_fantasia: loja.nome_fantasia,
      razao_social: loja.razao_social,
      pontos_totais,
      pontos_totais_coloracao,
      pontos_totais_tratamento,
      marcas: marcasFinal,
      vendedores: vendedoresFinal,
    },
    pageInfo,
  };
}
}

export default new LojaService();
