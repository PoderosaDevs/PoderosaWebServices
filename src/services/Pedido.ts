// src/services/PedidoService.ts
import { PrismaClient } from '@prisma/client';
import { PedidoInput } from '../inputs/Pedido';
import { prisma } from '../database';


export class PedidoService {
  async getPedidos() {
    return prisma.pedido.findMany();
  }

  async getPedido(id: number) {
    return prisma.pedido.findUnique({
      where: { id },
    });
  }

  async createPedido(data: PedidoInput) {
    return prisma.pedido.create({
      data,
    });
  }

  async updatePedido(id: number, data: PedidoInput) {
    return prisma.pedido.update({
      where: { id },
      data,
    });
  }

  async deletePedido(id: number) {
    try {
      await prisma.pedido.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete order:", error);
      return false;
    }
  }
}
