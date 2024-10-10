import { PrismaClient } from '@prisma/client';
import { LinhaCreateInput, LinhaUpdateInput } from '../inputs/Linha';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

class LinhaServices {
  // Obter todas as linhas
  async get() {
    const linhas = await prisma.linha.findMany({
      include: {
        tipo_sistemas: true,
        produtos: true,
        marca: true,
      },
    });

    return linhas;
  }

  // Obter uma linha por ID
  async getById(id: number) {
    const linha = await prisma.linha.findUnique({
      where: { id },
      include: {
        tipo_sistemas: true,
        produtos: true,
        marca: true,
      },
    });

    if (!linha) {
      throw new Error(`Linha com ID ${id} não encontrada.`);
    }

    return linha;
  }

  // Criar uma nova linha
  async create(data: LinhaCreateInput) {
    const tiposSistemas = await prisma.tipo_sistema.findMany({
      where: {
        nome: {
          in: data.tipo_sistemas_nomes || [],
        },
      },
    });

    if (tiposSistemas.length !== (data.tipo_sistemas_nomes?.length || 0)) {
      throw new GraphQLError("Alguns tipos de sistema fornecidos são inválidos.");
    }

    const tipoSistemaIds = tiposSistemas.map(ts => ts.id);

    const produtosIds = data.produtosIds || [];

    const linha = await prisma.linha.create({
      data: {
        nome: data.nome,
        marcaId: data.marcaId,
        tipo_sistemas: {
          create: tipoSistemaIds.map(id => ({
            tipo_sistema: {
              connect: { id },
            },
          })),
        },
        produtos: {
          connect: produtosIds.map(id => ({ id })),
        },
      },
    });

    return linha;
  }

  // Atualizar o nome de uma linha existente
  async update(input: LinhaUpdateInput) {
    const { id, nome } = input;

    const linha = await prisma.linha.update({
      where: { id },
      data: { nome },
    });

    return linha;
  }

  // Excluir uma linha por ID
  async delete(id: number) {
    const linha = await prisma.linha.delete({
      where: { id },
    });

    return linha;
  }
}


export default new LinhaServices();