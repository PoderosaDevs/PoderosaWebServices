import { prisma } from "../database";
import { CreateMetaInput } from "../inputs/Meta";

type Periodo = { inicio?: Date; fim?: Date };

export class MetaService {
  /**
   * Calcula o 1º e o último dia do mês corrente.
   */
  private getPeriodoPadrao(): { inicio: Date; fim: Date } {
    const agora = new Date();
    const inicio = new Date(
      agora.getFullYear(),
      agora.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const fim = new Date(
      agora.getFullYear(),
      agora.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
    return { inicio, fim };
  }

  /**
   * Converte "dd/MM/yyyy" em Date (00:00:00.000).
   * @throws Error se `dateStr` estiver fora do padrão.
   */
  private parseDateBr(dateStr: string): Date {
    const [dia, mes, ano] = dateStr.split("/").map(Number);
    if (!dia || !mes || !ano) throw new Error(`Data inválida: ${dateStr}`);
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
  }

  /**
   * Retorna metas de um usuário dentro de um período.
   * Se `periodo` for omitido usa o mês atual.
   * Aceita strings "dd/MM/yyyy" ou objetos Date.
   */
  async getMetasByUsuario(
    userId: number,
    periodo?: { inicio?: string | Date; fim?: string | Date }
  ) {
    /* ---------- Validações ---------- */
    if (!userId || userId <= 0) throw new Error("ID de usuário inválido.");

    let { inicio, fim } = periodo ?? {};

    if (typeof inicio === "string") inicio = this.parseDateBr(inicio);
    if (typeof fim === "string") fim = this.parseDateBr(fim);

    if (!inicio || !fim) ({ inicio, fim } = this.getPeriodoPadrao());

    if (fim instanceof Date) fim.setHours(23, 59, 59, 999);
    if (inicio > fim)
      throw new Error("A data de início não pode ser posterior à data de fim.");

    /* ---------- Query ---------- */
    try {
      // 1) Metas do usuário dentro do período solicitado
      const metas = await prisma.meta.findMany({
        where: {
          usuarioId: userId,
          AND: [{ data_inicio: { lte: fim } }, { data_fim: { gte: inicio } }],
        },
        include: {
          meta_etapas: true,
          marca: true,
        },
        orderBy: { data_fim: "asc" },
      });

      // 2) Para cada meta, soma a quantidade vendida da respectiva marca
      //    dentro do PERÍODO DA META (meta.data_inicio → meta.data_fim)
      const metasComAtual = await Promise.all(
        metas.map(async (meta) => {
          const resultado = await prisma.venda_detalhe.aggregate({
            where: {
              venda: {
                funcionario_id: userId,
                data_venda: { gte: meta.data_inicio, lte: meta.data_fim },
                situacao: true, // vendas confirmadas
              },
              produto: { id_marca: meta.marcaId },
            },
            _sum: { quantidade: true },
          });

          return {
            ...meta,
            quantidade_atual: resultado._sum.quantidade ?? 0,
          };
        })
      );

      return metasComAtual; // sempre array (vazio se não houver metas)
    } catch (err) {
      throw new Error(
        `Erro ao buscar metas para o usuário ${userId}: ${
          err instanceof Error ? err.message : "erro desconhecido"
        }`
      );
    }
  }

  async getMetaComEtapas(metaId: number) {
    if (!metaId || metaId <= 0) {
      throw new Error("ID da meta inválido.");
    }

    const meta = await prisma.meta.findUnique({
      where: { id: metaId },
      include: {
        meta_etapas: true,
        marca: true,
      },
    });

    if (!meta) {
      throw new Error("Meta não encontrada.");
    }

    return meta;
  }

  async criarMeta(data: CreateMetaInput) {
    const {
      nome,
      marcaId,
      quantidade_objetivo,
      data_inicio,
      data_fim,
      usuarioId, // ← agora é só UM usuário
      descricao,
      etapas,
    } = data;

    /* --------- Validações --------- */
    if (!nome?.trim()) throw new Error("Nome da meta é obrigatório.");
    if (quantidade_objetivo <= 0)
      throw new Error("Quantidade-objetivo deve ser maior que zero.");
    if (data_inicio > data_fim)
      throw new Error("Data de início não pode ser após a data de fim.");

    // Marca existente?
    const marcaExiste = await prisma.marca.findUnique({
      where: { id: marcaId },
    });
    if (!marcaExiste) throw new Error("Marca não encontrada.");

    // Usuário existente?
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });
    if (!usuarioExiste) throw new Error("Usuário não encontrado.");

    /* --------- Criação --------- */
    try {
      const novaMeta = await prisma.meta.create({
        data: {
          nome,
          descricao,
          marcaId,
          usuarioId, // ← FK direta
          quantidade_objetivo,
          data_inicio,
          data_fim,
          meta_etapas: etapas?.length
            ? {
                create: etapas.map((etapa) => ({
                  nome: etapa.nome,
                  quantidade_objetivo: etapa.quantidade_objetivo,
                  // `quantidade_atual` e `atingida` ficam com @default
                })),
              }
            : undefined,
        },
        include: {
          meta_etapas: true,
          marca: true,
          usuario: { select: { id: true, nome: true } },
        },
      });

      return novaMeta;
    } catch (err: any) {
      if (
        err.message?.includes("meta_marcaId_usuarioId_nome_data_inicio_key")
      ) {
        throw new Error(
          "Já existe uma meta com esse nome para a marca, usuário e data informados."
        );
      }
      throw new Error(`Erro ao criar meta: ${err.message ?? "desconhecido"}`);
    }
  }

  async deletarMeta(metaId: number) {
    if (!metaId || metaId <= 0) {
      throw new Error("ID da meta inválido.");
    }

    // -------- Verifica se existe --------
    const meta = await prisma.meta.findUnique({
      where: { id: metaId },
      select: { id: true },
    });

    if (!meta) {
      throw new Error("Meta não encontrada.");
    }

    // -------- Transação de exclusão --------
    await prisma.$transaction([
      prisma.meta_etapa.deleteMany({ where: { meta_id: metaId } }),
      prisma.meta.delete({ where: { id: metaId } }),
    ]);

    return { id: metaId, mensagem: "Meta e etapas removidas com sucesso." };
  }
}

export default new MetaService();
