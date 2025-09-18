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
    if (!Number.isFinite(userId) || userId <= 0) {
      throw new Error("ID de usuário inválido.");
    }

    let { inicio, fim } = periodo ?? {};

    if (typeof inicio === "string") inicio = this.parseDateBr(inicio);
    if (typeof fim === "string") fim = this.parseDateBr(fim);

    if (!inicio || !fim) ({ inicio, fim } = this.getPeriodoPadrao());

    if (!(inicio instanceof Date) || isNaN(+inicio)) {
      throw new Error("Data de início inválida.");
    }
    if (!(fim instanceof Date) || isNaN(+fim)) {
      throw new Error("Data de fim inválida.");
    }

    // inclui o dia inteiro do fim
    fim.setHours(23, 59, 59, 999);

    if (inicio > fim) {
      throw new Error("A data de início não pode ser posterior à data de fim.");
    }

    /* ---------- Query ---------- */
    try {
      return await prisma.$transaction(async (tx) => {
        // 1) Metas do usuário dentro do período solicitado
        const metas = await tx.meta.findMany({
          where: {
            usuarios: { some: { id: userId } },
            AND: [{ data_inicio: { lte: fim } }, { data_fim: { gte: inicio } }],
          },
          include: {
            meta_etapas: true,
            marca: true,
            // se quiser retornar também os usuários ligados à meta, descomente:
            // usuarios: { select: { id: true, nome: true } },
          },
          orderBy: { data_fim: "asc" },
        });

        if (metas.length === 0) return [];

        // 2) Para cada meta, soma a quantidade vendida da respectiva marca
        //    dentro do PERÍODO DA META (meta.data_inicio → meta.data_fim)
        const metasComAtual = await Promise.all(
          metas.map(async (meta) => {
            const agg = await tx.venda_detalhe.aggregate({
              where: {
                venda: {
                  funcionario_id: userId,
                  data_venda: { gte: meta.data_inicio, lte: meta.data_fim },
                  situacao: true, // somente vendas confirmadas
                },
                produto: { id_marca: meta.marcaId },
              },
              _sum: { quantidade: true },
            });

            return {
              ...meta,
              quantidade_atual: agg._sum.quantidade ?? 0,
            };
          })
        );

        return metasComAtual; // sempre array
      });
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
      usuarioIds,
      descricao,
      etapas = [],
    } = data;

    /* --------- Validações --------- */
    if (!nome?.trim()) throw new Error("Nome da meta é obrigatório.");
    if (!Array.isArray(usuarioIds) || usuarioIds.length === 0) {
      throw new Error("Selecione ao menos um usuário.");
    }
    if (quantidade_objetivo <= 0) {
      throw new Error("Quantidade-objetivo deve ser maior que zero.");
    }

    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    if (isNaN(+inicio) || isNaN(+fim)) {
      throw new Error("Datas inválidas.");
    }
    if (inicio > fim) {
      throw new Error("Data de início não pode ser após a data de fim.");
    }
    // garante fim do dia
    fim.setHours(23, 59, 59, 0);

    // Marca existente?
    const marca = await prisma.marca.findUnique({ where: { id: marcaId } });
    if (!marca) throw new Error("Marca não encontrada.");

    /* --------- Resolve usuários --------- */
    let resolvedUserIds: number[];
    if (usuarioIds.includes(0)) {
      // 0 = todos funcionários
      const todos = await prisma.usuario.findMany({
        where: { tipo_pessoa: "EMPLOYEE" }, // ajuste se o literal do enum diferir
        select: { id: true },
      });
      resolvedUserIds = [...new Set(todos.map((u) => u.id))];
      if (resolvedUserIds.length === 0) {
        throw new Error("Nenhum funcionário encontrado para atribuir a meta.");
      }
    } else {
      const uniq = [
        ...new Set(usuarioIds.filter((n) => Number.isFinite(n) && n > 0)),
      ];
      if (uniq.length === 0)
        throw new Error("Selecione ao menos um usuário válido.");

      const existentes = await prisma.usuario.findMany({
        where: { id: { in: uniq } },
        select: { id: true },
      });
      const ok = new Set(existentes.map((u) => u.id));
      const faltando = uniq.filter((id) => !ok.has(id));
      if (faltando.length) {
        throw new Error(`Usuário(s) não encontrado(s): ${faltando.join(", ")}`);
      }
      resolvedUserIds = uniq;
    }

    /* --------- Criação --------- */
    try {
      const novaMeta = await prisma.meta.create({
        data: {
          nome,
          descricao,
          quantidade_objetivo,
          data_inicio: inicio, // Date válido
          data_fim: fim, // normalizado p/ 23:59:59
          marca: { connect: { id: marcaId } },
          usuarios: {
            connect: resolvedUserIds.map((id) => ({ id })), // M:N correto
          },
          meta_etapas:
            (etapas?.length ?? 0) > 0
              ? {
                  create: etapas!.map((et) => ({
                    nome: et.nome,
                    quantidade_objetivo: et.quantidade_objetivo,
                  })),
                }
              : undefined,
        },
        include: {
          marca: true,
          usuarios: { select: { id: true, nome: true } },
          meta_etapas: true,
        },
      });

      return novaMeta;
    } catch (err: any) {
      if (err?.code === "P2002") {
        // viola @@unique([marcaId, nome, data_inicio])
        throw new Error(
          "Já existe uma meta com esse nome para a marca e data de início informados."
        );
      }
      if (err?.code === "P2003") {
        // violação de FK
        throw new Error(
          "Relacionamento inválido. Verifique se a marca e os usuários existem."
        );
      }
      throw new Error(`Erro ao criar meta: ${err?.message ?? "desconhecido"}`);
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
