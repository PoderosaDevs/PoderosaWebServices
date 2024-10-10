// src/services/CategoriaService.ts
import { PrismaClient } from '@prisma/client';
import { CategoriaInput } from '../inputs/Categoria';
import { prisma } from '../database';

export class CategoriaService {
  async getCategorias() {
    return prisma.categoria.findMany();
  }

  async getCategoria(id: number) {
    return prisma.categoria.findUnique({
      where: { id },
    });
  }

  async createCategoria(data: CategoriaInput) {
    return prisma.categoria.create({
      data,
    });
  }

  async updateCategoria(id: number, data: CategoriaInput) {
    return prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async deleteCategoria(id: number) {
    try {
      await prisma.categoria.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete category:", error);
      return false;
    }
  }
}
