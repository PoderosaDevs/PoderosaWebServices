import { PrismaClient } from "@prisma/client";
import { Pagination } from "../inputs/Utils";
import { LojaResult } from "../models/Loja";
import getPageInfo from "../helpers/getPageInfo";
import { endOfDay, endOfMonth, parse, startOfMonth } from "date-fns";

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
    quantidade: number = 10
  ) {
    const parseDate = (dateStr: string) =>
      parse(dateStr, "dd/MM/yyyy", new Date());

    const inicio = startDate ? parseDate(startDate) : startOfMonth(new Date());
    const fim = endDate
      ? endOfDay(parseDate(endDate))
      : endOfDay(endOfMonth(new Date()));

    const dataFilter = {
      data_venda: {
        gte: inicio,
        lte: fim,
      },
    };

    const vendas = await prisma.venda.findMany({
      where: {
        loja_id: lojaId,
        situacao: true,
        ...dataFilter,
      },
      skip: pagina * quantidade,
      take: quantidade,
      select: {
        funcionario_id: true,
        venda_detalhe: {
          select: {
            quantidade: true,
            produto: {
              select: {
                nome: true,
                marca: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const dataTotal = await prisma.venda.count({
      where: {
        loja_id: lojaId,
        situacao: true,
        ...dataFilter,
      },
    });

    const pageInfo = getPageInfo(dataTotal, pagina, quantidade);

    const loja = await prisma.loja.findUnique({
      where: { id: lojaId },
      select: {
        id: true,
        nome_fantasia: true,
        razao_social: true,
      },
    });

    if (!loja) {
      throw new Error("Loja não encontrada");
    }

    let pontos_totais = 0;
    let pontos_totais_tratamento = 0;
    let pontos_totais_coloracao = 0;

    const marcasMap = new Map<
      number,
      {
        id: number;
        nome: string;
        quantidade: number;
        pontos_tratamento: number;
        pontos_coloracao: number;
      }
    >();

    const vendedoresMap = new Map<
      number,
      {
        nome: string;
        quantidade: number;
        pontos_totais_tratamento: number;
        pontos_totais_coloracao: number;
      }
    >();

    const funcionarioIds = Array.from(
      new Set(vendas.map((v) => v.funcionario_id).filter(Boolean))
    ) as number[];

    const usuarios = await prisma.usuario.findMany({
      where: { id: { in: funcionarioIds } },
      select: {
        id: true,
        nome: true,
      },
    });

    usuarios.forEach((usuario) => {
      vendedoresMap.set(usuario.id, {
        nome: usuario.nome,
        quantidade: 0,
        pontos_totais_tratamento: 0,
        pontos_totais_coloracao: 0,
      });
    });

    for (const venda of vendas) {
      let totalVenda = 0;
      let pontosTratamentoVenda = 0;
      let pontosColoracaoVenda = 0;

      for (const detalhe of venda.venda_detalhe) {
        const qtd = detalhe.quantidade;
        const nomeProduto = detalhe.produto?.nome ?? "";

        pontos_totais += qtd;
        totalVenda += qtd;

        const isTratamento = nomeProduto.startsWith("T ");
        const isColoracao = nomeProduto.startsWith("C ");

        if (isTratamento) {
          pontos_totais_tratamento += qtd;
          pontosTratamentoVenda += qtd;
        } else if (isColoracao) {
          pontos_totais_coloracao += qtd;
          pontosColoracaoVenda += qtd;
        }

        const marca = detalhe.produto?.marca;
        if (marca) {
          if (!marcasMap.has(marca.id)) {
            marcasMap.set(marca.id, {
              id: marca.id,
              nome: marca.nome,
              quantidade: 0,
              pontos_tratamento: 0,
              pontos_coloracao: 0,
            });
          }

          const marcaData = marcasMap.get(marca.id)!;
          marcaData.quantidade += qtd;
          if (isTratamento) marcaData.pontos_tratamento += qtd;
          if (isColoracao) marcaData.pontos_coloracao += qtd;
        }
      }

      const vendedorId = venda.funcionario_id;
      if (vendedorId && vendedoresMap.has(vendedorId)) {
        const v = vendedoresMap.get(vendedorId)!;
        v.quantidade += totalVenda;
        v.pontos_totais_tratamento += pontosTratamentoVenda;
        v.pontos_totais_coloracao += pontosColoracaoVenda;
      }
    }

    const vendedoresFinal = Array.from(vendedoresMap.values())
      .map((v) => ({
        ...v,
        pontos_totais_tratamento: v.pontos_totais_tratamento ?? 0,
        pontos_totais_coloracao: v.pontos_totais_coloracao ?? 0,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    const marcasFinal = Array.from(marcasMap.values())
      .map((m) => ({
        ...m,
        pontos_tratamento: m.pontos_tratamento ?? 0,
        pontos_coloracao: m.pontos_coloracao ?? 0,
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    if (vendas.length === 0 || pontos_totais === 0) {
      return {
        result: {
          id: loja.id,
          nome_fantasia: loja.nome_fantasia,
          razao_social: loja.razao_social,
          pontos_totais: 0,
          pontos_totais_coloracao: 0,
          pontos_totais_tratamento: 0,
          marcas: [],
          vendedores: [],
        },
        pageInfo,
      };
    }

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
