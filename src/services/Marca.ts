// marcaService.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class MarcaServices {
  async get() {
    return prisma.marca.findMany();
  }

  async getById(id: number) {
    return prisma.marca.findUnique({ where: { id } });
  }

  async create(nome: string) {
    return prisma.marca.create({ data: { nome } });
  }

  async associationProdutos(linhaId: number, produtoIds: number[]) {
    return prisma.marca.update({
      where: { id: linhaId },
      data: {
        produtos: {
          connect: produtoIds.map((id) => ({ id })),
        },
      },
    });
  }


  async update(id: number, nome: string) {
    return prisma.marca.update({
      where: { id },
      data: { nome },
    });
  }

  async delete(id: number) {
    return prisma.marca.delete({ where: { id } });
  }
}


export default new MarcaServices()