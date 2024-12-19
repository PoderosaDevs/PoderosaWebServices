import { PrismaClient } from '@prisma/client';
import { DiaTrabalhadoEstoqueInputUpdate } from '../../inputs/estoque/DiaTrabalho';

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
    usuarioId: number; // obrigatório
    data_trabalho: Date; // Adicionando data_trabalho como um campo
  }) {
    // Verifica se o usuário faz parte de uma dupla
    const dupla = await prisma.dupla_estoque.findFirst({
      where: {
        OR: [
          { usuarioId1: data.usuarioId },
          { usuarioId2: data.usuarioId },
        ],
      },
    });
  
    // Se o usuário não estiver em uma dupla, não cria nada
    if (!dupla) {
      throw new Error('Usuário não está associado a uma dupla.');
    }
  
    // Identifica o ID do parceiro na dupla
    const parceiroId = dupla.usuarioId1 === data.usuarioId ? dupla.usuarioId2 : dupla.usuarioId1;
  
    // Verifica se já existe um registro com a mesma data_trabalho para o usuário
    const existingRecordUser = await prisma.dia_trabalhado_estoque.findFirst({
      where: {
        usuario_id: data.usuarioId,
        data_trabalho: data.data_trabalho,
      },
    });
  
    if (existingRecordUser) {
      throw new Error('Já existe um registro de dia trabalhado para o usuário na mesma data.');
    }
  
    // Verifica se já existe um registro com a mesma data_trabalho para o parceiro
    const existingRecordPartner = await prisma.dia_trabalhado_estoque.findFirst({
      where: {
        usuario_id: parceiroId,
        data_trabalho: data.data_trabalho,
      },
    });
  
    // Cria o registro de dia_trabalhado_estoque para o usuário
    const diaTrabalhado = await prisma.dia_trabalhado_estoque.create({
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
        data_trabalho: data.data_trabalho,
      },
    });
  
    // Se o parceiro não tiver um registro para o mesmo dia, cria um registro para ele
    if (!existingRecordPartner) {
      await prisma.dia_trabalhado_estoque.create({
        data: {
          pedidos: data.pedidos,
          realizados: data.realizados,
          horario_entrada: data.horario_entrada,
          horario_saida: data.horario_saida,
          usuario: {
            connect: {
              id: parceiroId,
            },
          },
          data_trabalho: data.data_trabalho,
        },
      });
    }
  
    return diaTrabalhado;
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
  async update(data: DiaTrabalhadoEstoqueInputUpdate ) {
    return await prisma.dia_trabalhado_estoque.update({
      where: { id: data.id},
      data: {
        data_trabalho: data.data_trabalho,
        pedidos: data.pedidos,
        realizados: data.realizados,
        horario_entrada: data.horario_entrada,
        horario_saida: data.horario_saida,
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
