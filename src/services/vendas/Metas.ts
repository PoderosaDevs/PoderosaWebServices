import { prisma } from "../../database";
import { CreateMetaInput, UpdateMetaInput } from "../../inputs/vendas/Metas";
import { Etapa } from "../../models/vendas/Metas";

class MetaServices {
  async get() {
    return await prisma.meta.findMany({
      include: {
        etapas: true, // Incluir etapas relacionadas
      },
    });
  }

  async getById(id: number){
    return await prisma.meta.findUnique({
      where: { id },
      include: {
        etapas: true, // Incluir etapas associadas
      },
    });
  }

  async create(data: CreateMetaInput) {
    return await prisma.meta.create({
      data: {
        quantidade_total: data.quantidade_total,
        descricao: data.descricao,
        situacao: data.situacao,
        marca_id: data.marca_id,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        etapas: {
          create: data.etapas?.map((etapa) => ({
            quantidade: etapa.quantidade,
          })),
        },
      },
    });
  }

  async update(data: UpdateMetaInput) {
    return await prisma.meta.update({
      where: { id: data.id },
      data: {
        quantidade_total: data.quantidade_total,
        situacao: data.situacao,
        marca_id: data.marca_id,
        descricao: data.descricao,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        etapas: {
          update: data.etapas?.map((etapa) => ({
            where: { id: etapa.id },
            data: { quantidade: etapa.quantidade },
          })),
        },
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.meta.delete({
      where: { id },
    });
    return true;
  }
}


export default new MetaServices();