import { PrismaClient } from "@prisma/client";
import { Pagination } from "../inputs/Utils";
import { LojaResult } from "../models/Loja";
import getPageInfo from "../helpers/getPageInfo";

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
}

export default new LojaService();
