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
  // Service:
  async getMetasByUsuario(
    userId: number,
    periodo?: { inicio?: string | Date; fim?: string | Date }
  ) {
    const fmt = (d?: Date | string | null) => {
      if (!d) return d;
      if (d instanceof Date)
        return isNaN(+d) ? "Invalid Date" : d.toISOString();
      return d; // string original antes do parse
    };

    console.debug("[MetaService.getMetasByUsuario] start", {
      userId,
      periodo_raw: {
        inicio: fmt(periodo?.inicio ?? null),
        fim: fmt(periodo?.fim ?? null),
      },
    });

    /* ---------- Validações ---------- */
    if (!Number.isFinite(userId) || userId <= 0) {
      console.warn("[MetaService] invalid userId", { userId });
      throw new Error("ID de usuário inválido.");
    }

    let { inicio, fim } = periodo ?? {};

    // Antes do parse
    console.debug("[MetaService] before-parse", {
      inicio: fmt(inicio ?? null),
      fim: fmt(fim ?? null),
    });

    if (typeof inicio === "string") inicio = this.parseDateBr(inicio);
    if (typeof fim === "string") fim = this.parseDateBr(fim);

    // Se não veio período completo, usa padrão
    if (!inicio || !fim) {
      const padrao = this.getPeriodoPadrao();
      inicio = inicio ?? padrao.inicio;
      fim = fim ?? padrao.fim;
      console.debug("[MetaService] applied-default-period", {
        default_from_getPeriodoPadrao: {
          inicio: fmt(padrao.inicio),
          fim: fmt(padrao.fim),
        },
      });
    }

    // Normaliza fim para incluir o dia inteiro
    if (fim instanceof Date && !isNaN(+fim)) {
      fim = new Date(fim); // evita mutar referência externa
      fim.setHours(23, 59, 59, 999);
    }

    console.debug("[MetaService] after-parse-and-normalization", {
      inicio_iso: fmt(inicio as Date),
      fim_iso: fmt(fim as Date),
      inicio_ms: inicio instanceof Date ? +inicio : undefined,
      fim_ms: fim instanceof Date ? +fim : undefined,
    });

    if (!(inicio instanceof Date) || isNaN(+inicio)) {
      console.error("[MetaService] invalid start date", {
        inicio: fmt(inicio as any),
      });
      throw new Error("Data de início inválida.");
    }
    if (!(fim instanceof Date) || isNaN(+fim)) {
      console.error("[MetaService] invalid end date", { fim: fmt(fim as any) });
      throw new Error("Data de fim inválida.");
    }

    if (inicio > fim) {
      console.warn("[MetaService] start-after-end", {
        inicio: fmt(inicio),
        fim: fmt(fim),
      });
      throw new Error("A data de início não pode ser posterior à data de fim.");
    }

    /* ---------- Query ---------- */
    try {
      console.info("[MetaService] querying metas", {
        userId,
        where_preview: {
          usuarios_some_id: userId,
          overlap: { data_inicio_lte: fmt(fim), data_fim_gte: fmt(inicio) },
        },
      });

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
          },
          orderBy: { data_fim: "asc" },
        });

        console.info("[MetaService] metas found", {
          userId,
          count: metas.length,
          search_period: { inicio: fmt(inicio), fim: fmt(fim) },
        });

        if (metas.length === 0) {
          console.warn("[MetaService] no metas returned for filters", {
            userId,
            filters: {
              usuarios_some_id: userId,
              data_inicio_lte: fmt(fim),
              data_fim_gte: fmt(inicio),
            },
          });
          return [];
        }

        // 2) Para cada meta, soma a quantidade vendida da respectiva marca
        const metasComAtual = await Promise.all(
          metas.map(async (meta) => {
            console.debug("[MetaService] aggregating for meta", {
              metaId: meta.id,
              nome: meta.nome,
              marcaId: meta.marcaId,
              periodo_meta: {
                inicio: fmt(meta.data_inicio),
                fim: fmt(meta.data_fim),
              },
            });

            const agg = await tx.venda_detalhe.aggregate({
              where: {
                venda: {
                  funcionario_id: userId,
                  data_venda: { gte: meta.data_inicio, lte: meta.data_fim },
                  situacao: true,
                },
                produto: { id_marca: meta.marcaId },
              },
              _sum: { quantidade: true },
            });

            const quantidade_atual = agg._sum.quantidade ?? 0;

            console.debug("[MetaService] aggregate result", {
              metaId: meta.id,
              quantidade_atual,
            });

            return {
              ...meta,
              quantidade_atual,
            };
          })
        );

        console.info("[MetaService] done", {
          userId,
          returned: metasComAtual.length,
        });

        return metasComAtual;
      });
    } catch (err) {
      console.error("[MetaService] error while querying metas", {
        userId,
        error: err instanceof Error ? err.message : err,
      });
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
