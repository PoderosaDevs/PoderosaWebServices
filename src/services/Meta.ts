// services/Meta.ts
import { prisma } from "../database";
import { MetaModel, MetaEtapaModel } from "../models/Meta";

class MetaService {
  // Método para obter todas as metas de um usuário e suas etapas
  async obterMetasPorUsuario(usuarioId: number) {
    try {
      const metas = await prisma.meta.findMany({
        where: {
          usuario_id: usuarioId,
        },
        include: {
          meta_etapas: true, // Inclui as etapas associadas à meta
        },
      });
      return metas;
    } catch (error) {
      console.error("Erro ao obter metas do usuário:", error);
      throw new Error("Não foi possível obter as metas.");
    }
  }

  // Método para obter uma meta específica e suas etapas
  async obterMetaPorId(id: number) {
    try {
      const meta = await prisma.meta.findUnique({
        where: {
          id: id,
        },
        include: {
          meta_etapas: true, // Inclui as etapas associadas à meta
        },
      });
      return meta;
    } catch (error) {
      console.error("Erro ao obter meta por ID:", error);
      throw new Error("Não foi possível obter a meta.");
    }
  }

  // Método para criar uma nova meta e suas etapas associadas
  async criarMetaComEtapas(data: {
    nome: string;
    descricao?: string;
    usuario_id: number;
    pontos_objetivo: number;
    marcaId?: number;
    etapas: {
      etapa_numero: number;
      quantidade: number;
      recompensa: string;
      valor: number;
      importancia: number;
    }[];
  }) {
    const { nome, descricao, usuario_id, pontos_objetivo, marcaId, etapas } =
      data;

    // try {
    //   const novaMeta = await prisma.meta.create({
    //     data: {
    //       nome,
    //       descricao,
    //       usuario_id,
    //       pontos_objetivo,
    //       marcaId,
    //       meta_etapas: {
    //         create: etapas, // Cria as etapas associadas à meta
    //       },
    //     },
    //     include: {
    //       meta_etapas: true, // Inclui as etapas associadas à meta criada
    //     },
    //   });

    //   return novaMeta;
    // } catch (error) {
    //   console.error("Erro ao criar meta e etapas:", error);
    //   throw new Error("Não foi possível criar a meta e as etapas.");
    // }
  }

  // Método para atualizar as etapas de uma meta existente
  async atualizarEtapas(
    metaId: number,
    etapas: {
      id: number;
      quantidade: number;
      recompensa: string;
      valor: number;
      importancia: number;
      atingida: boolean;
    }[]
  ) {
    try {
      const etapasAtualizadas = await prisma.meta_etapa.updateMany({
        where: {
          meta_id: metaId,
          id: {
            in: etapas.map((etapa) => etapa.id), // Encontra as etapas pela lista de IDs
          },
        },
        data: etapas.reduce(
          (
            acc: {
              id: number;
              quantidade: number;
              recompensa: string;
              valor: number;
              importancia: number;
              atingida: boolean;
            }[],
            etapa
          ) => {
            acc.push({
              id: etapa.id,
              quantidade: etapa.quantidade,
              recompensa: etapa.recompensa,
              valor: etapa.valor,
              importancia: etapa.importancia,
              atingida: etapa.atingida,
            });
            return acc;
          },
          []
        ),
      });

      return etapasAtualizadas;
    } catch (error) {
      console.error("Erro ao atualizar etapas:", error);
      throw new Error("Não foi possível atualizar as etapas.");
    }
  }

  // Método para excluir uma meta e suas etapas associadas
  async deletarMetaComEtapas(id: number): Promise<void> {
    try {
      // Exclui as etapas associadas à meta
      await prisma.meta_etapa.deleteMany({
        where: {
          meta_id: id,
        },
      });

      // Exclui a meta
      await prisma.meta.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Erro ao excluir meta e etapas:", error);
      throw new Error("Não foi possível excluir a meta e suas etapas.");
    }
  }
}

export default new MetaService();
