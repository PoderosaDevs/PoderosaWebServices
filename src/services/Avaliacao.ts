// src/services/AvaliacaoService.ts
import { PrismaClient } from '@prisma/client';
import { AvaliacaoInput } from '../inputs/Avaliacao';
import { prisma } from '../database';

class AvaliacaoService {
  async get() {
    return prisma.avaliacao.findMany({
      include: {
        produto: true,
        usuario: true,
      },
    });
  }

  async getByID(id: number) {
    return prisma.avaliacao.findUnique({
      where: { id },
      include: {
        produto: true,
        usuario: true,
      },
    });
  }

  async create(data: AvaliacaoInput) {
    return prisma.avaliacao.create({
      data,
    });
  }

  async update(id: number, data: AvaliacaoInput) {
    return prisma.avaliacao.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    try {
      await prisma.avaliacao.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Falha ao deletar:", error);
      return false;
    }
  }
}


export default new AvaliacaoService();