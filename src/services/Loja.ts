import { PrismaClient } from "@prisma/client";
import { Pagination } from "../inputs/Utils";
import { LojaResult } from "../models/Loja";
import getPageInfo from "../helpers/getPageInfo";
import { endOfMonth, parse, startOfMonth } from "date-fns";

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

  async delete(id: number) {
    return prisma.loja.delete({ where: { id } });
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
    const fim = endDate ? parseDate(endDate) : endOfMonth(new Date());

    // Buscar vendas da loja no intervalo
    const vendas = await prisma.venda.findMany({
      where: {
        loja_id: lojaId,
        situacao: true,
        data_venda: {
          gte: inicio,
          lte: fim,
        },
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
                id: true,
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

    // Contagem total para paginação
    const dataTotal = await prisma.venda.count({
      where: {
        loja_id: lojaId,
        situacao: true,
        data_venda: {
          gte: inicio,
          lte: fim,
        },
      },
    });

    const pageInfo = getPageInfo(dataTotal, pagina, quantidade);

    if (!vendas || vendas.length === 0) {
      return {
        result: {
          id: lojaId,
          nome_fantasia: "",
          razao_social: "",
          pontos_totais: 0,
          marca: [],
          vendedores: [],
        },
        pageInfo,
      };
    }

    // Pegar dados da loja
    const loja = await prisma.loja.findUnique({
      where: { id: lojaId },
      select: {
        id: true,
        nome_fantasia: true,
        razao_social: true,
      },
    });

    // Inicializar mapas
    const vendedoresMap = new Map<
      number,
      {
        id: number;
        nome: string;
        email: string;
        tipo_pessoa: string;
        quantidade: number;
      }
    >();
    const marcasMap = new Map<
      number,
      { id: number; nome: string; quantidade: number }
    >();

    let pontosTotais = 0;

    // IDs únicos de funcionários
    const funcionarioIds = Array.from(
      new Set(vendas.map((v) => v.funcionario_id).filter((id) => id !== null))
    ) as number[];

    // Buscar funcionários
    const usuariosFromDb = await prisma.usuario.findMany({
      where: { id: { in: funcionarioIds } },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_pessoa: true,
      },
    });

    // Inicializar vendedores
    usuariosFromDb.forEach((user) => {
      vendedoresMap.set(user.id, { ...user, quantidade: 0 });
    });

    // Acumular quantidades
    for (const venda of vendas) {
      const funcionarioId = venda.funcionario_id;

      const qtdTotalVenda = venda.venda_detalhe.reduce(
        (acc, vd) => acc + vd.quantidade,
        0
      );
      pontosTotais += qtdTotalVenda;

      if (funcionarioId && vendedoresMap.has(funcionarioId)) {
        const vendedorAtual = vendedoresMap.get(funcionarioId)!;
        vendedorAtual.quantidade += qtdTotalVenda;
        vendedoresMap.set(funcionarioId, vendedorAtual);
      }

      for (const detalhe of venda.venda_detalhe) {
        const qtd = detalhe.quantidade;
        const marca = detalhe.produto.marca;

        if (marca) {
          const marcaAtual = marcasMap.get(marca.id) ?? {
            id: marca.id,
            nome: marca.nome,
            quantidade: 0,
          };
          marcaAtual.quantidade += qtd;
          marcasMap.set(marca.id, marcaAtual);
        }
      }
    }

    const vendedoresFinal = Array.from(vendedoresMap.values()).sort(
      (a, b) => b.quantidade - a.quantidade
    );
    const marcasFinal = Array.from(marcasMap.values()).sort(
      (a, b) => b.quantidade - a.quantidade
    );

    return {
      result: {
        id: loja!.id,
        nome_fantasia: loja!.nome_fantasia,
        razao_social: loja!.razao_social,
        pontos_totais: pontosTotais,
        marca: marcasFinal,
        vendedores: vendedoresFinal,
      },
      pageInfo,
    };
  }
}

export default new LojaService();
