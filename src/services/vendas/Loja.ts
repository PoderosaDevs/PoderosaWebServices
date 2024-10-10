import { PrismaClient } from '@prisma/client';
import { LojaCreateInput, LojaUpdateInput } from '../../inputs/vendas/Loja';

const prisma = new PrismaClient();

class LojaServices {
  // Obter todas as lojas
  async get() {
    return await prisma.loja.findMany({
      include: {
        vendas: true, // Inclua relacionamentos conforme necessário
      },
    });
  }

  // Obter uma loja por ID
  async getById(id: number) {
    const loja = await prisma.loja.findUnique({
      where: { id },
      include: {
        vendas: true, // Inclua relacionamentos conforme necessário
      },
    });

    if (!loja) {
      throw new Error(`Loja com ID ${id} não encontrada.`);
    }

    return loja;
  }

  // Criar uma nova loja
  async create(data: LojaCreateInput) {
    const loja = await prisma.loja.create({
      data: {
        nome_fantasia: data.nome_fantasia,
        razao_social: data.razao_social,
      }
    });

    return loja;
  }

  // Atualizar uma loja existente
  async update(input: LojaUpdateInput) {
    const { id, nome_fantasia, razao_social } = input;

    const loja = await prisma.loja.update({
      where: { id },
      data: { nome_fantasia, razao_social },
    });

    return loja;
  }

  // Excluir uma loja por ID
  async delete(id: number) {
    const loja = await prisma.loja.delete({
      where: { id },
    });

    return loja;
  }
}

export default new LojaServices();
