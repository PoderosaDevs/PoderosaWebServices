import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DiaTrabalhadoEstoqueServices {

  async getAll(singleDate?: Date, startDate?: Date, endDate?: Date) {
    const whereConditions: any = {};

    if (singleDate) {
      // Filtra por uma data específica (ignora o horário, verifica apenas o dia)
      whereConditions.data_trabalho = {
        gte: new Date(singleDate.setHours(0, 0, 0, 0)), // Início do dia
        lt: new Date(singleDate.setHours(23, 59, 59, 999)), // Fim do dia
      };
    } else if (startDate && endDate) {
      // Filtra por um intervalo de datas
      whereConditions.data_trabalho = {
        gte: new Date(startDate.setHours(0, 0, 0, 0)), // Início do dia de início
        lt: new Date(endDate.setHours(23, 59, 59, 999)), // Fim do dia de término
      };
    }

    return await prisma.dia_trabalhado_estoque.findMany({
      where: whereConditions,
      select: {
        id: true,
        pedidos: true,
        realizados: true,
        horario_entrada: true,
        horario_saida: true,
        data_trabalho: true,
      },
    });
  }

  // Criar um novo registro de dia trabalhado
  async create(data: {
    pedidos: number;
    realizados: number;
    horario_entrada: string;
    horario_saida: string;
    usuarioId: number; // agora é obrigatório
    data_trabalho: Date; // Adicionando data_trabalho como um campo
  }) {
    // Verifica se já existe um registro com a mesma data_trabalho
    const existingRecord = await prisma.dia_trabalhado_estoque.findFirst({
      where: {
        usuarioId: data.usuarioId,
        data_trabalho: data.data_trabalho, // Usando data_trabalho do parâmetro
      },
    });

    if (existingRecord) {
      throw new Error('Já existe um registro de dia trabalhado para a mesma data.');
    }

    return await prisma.dia_trabalhado_estoque.create({
      data: {
        pedidos: data.pedidos,
        realizados: data.realizados,
        horario_entrada: data.horario_entrada,
        horario_saida: data.horario_saida,
        usuario: {
          connect: {
            id: data.usuarioId,
          },
        },
        data_trabalho: data.data_trabalho, // Utilizando a data recebida
      },
    });
  }


  // Buscar todos os registros de dia trabalhado
  async get(usuarioId: number, startDate?: Date, endDate?: Date) {
    const whereConditions: any = {
      usuarioId: usuarioId, // Filtra os registros pelo ID do usuário
    };
  
    // Adiciona condições de data se os parâmetros forem fornecidos
    if (startDate) {
      whereConditions.data_trabalho = {
        gte: startDate, // Maior ou igual à data de início
      };
    }
  
    if (endDate) {
      whereConditions.data_trabalho = {
        ...whereConditions.data_trabalho,
        lt: new Date(endDate.setHours(23, 59, 59, 999)), // Menor que o final do dia da data de término
      };
    }
  
    return await prisma.dia_trabalhado_estoque.findMany({
      where: whereConditions,
      select: {
        id: true,
        pedidos: true,
        realizados: true,
        horario_entrada: true,
        horario_saida: true,
        data_trabalho: true,
      },
    });
  }
  

  // Buscar um registro específico pelo ID
  async getById(id: number) {
    return await prisma.dia_trabalhado_estoque.findUnique({
      where: { id },
      include: {
        usuario: true, // Incluir informações do usuário se necessário
      },
    });
  }

  // Atualizar um registro de dia trabalhado
  async update(id: number, data: {
    pedidos?: number;
    realizados?: number;
    horario_entrada?: string;
    horario_saida?: string;
    usuarioId?: number;
  }) {
    return await prisma.dia_trabalhado_estoque.update({
      where: { id },
      data: {
        pedidos: data.pedidos,
        realizados: data.realizados,
        horario_entrada: data.horario_entrada,
        horario_saida: data.horario_saida,
        usuario: data.usuarioId ? {
          connect: { id: data.usuarioId },
        } : undefined,
      },
    });
  }

  // Deletar um registro de dia trabalhado
  async delete(id: number) {
    return await prisma.dia_trabalhado_estoque.delete({
      where: { id },
    });
  }
}

export default new DiaTrabalhadoEstoqueServices();
