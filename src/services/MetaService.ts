import { Op } from "sequelize";
import { sequelize } from "../config/database";
import { Marca, Meta, MetaEtapa, Produto, Usuario, Venda, VendaDetalhe } from "../database/models";
import { ApiError } from "../utils/apiError";
import { TipoPessoa } from "../types/enums";

interface MetaEtapaInput {
  nome: string;
  quantidade_objetivo: number;
}

interface CreateMetaInput {
  nome: string;
  marcaId: number;
  quantidade_objetivo: number;
  data_inicio: Date;
  data_fim: Date;
  usuarioIds: number[];
  descricao?: string;
  etapas?: MetaEtapaInput[];
}

class MetaService {
  private getPeriodoPadrao(): { inicio: Date; fim: Date } {
    const agora = new Date();
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
    const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
    return { inicio, fim };
  }

  private parseDateBr(dateStr: string): Date {
    const [dia, mes, ano] = dateStr.split("/").map(Number);
    if (!dia || !mes || !ano) throw new Error(`Data invalida: ${dateStr}`);
    return new Date(ano, mes - 1, dia, 0, 0, 0, 0);
  }

  async getMetasByUsuario(userId: number, periodo?: { inicio?: string | Date; fim?: string | Date }) {
    if (!Number.isFinite(userId) || userId <= 0) {
      throw ApiError.badRequest("ID de usuario invalido.");
    }

    let { inicio, fim } = periodo ?? {};
    if (typeof inicio === "string") inicio = this.parseDateBr(inicio);
    if (typeof fim === "string") fim = this.parseDateBr(fim);

    if (!inicio || !fim) {
      const padrao = this.getPeriodoPadrao();
      inicio = inicio ?? padrao.inicio;
      fim = fim ?? padrao.fim;
    }
    if (fim instanceof Date && !isNaN(+fim)) {
      fim = new Date(fim);
      fim.setHours(23, 59, 59, 999);
    }

    if (!(inicio instanceof Date) || isNaN(+inicio)) throw ApiError.badRequest("Data de inicio invalida.");
    if (!(fim instanceof Date) || isNaN(+fim)) throw ApiError.badRequest("Data de fim invalida.");
    if (inicio > fim) throw ApiError.badRequest("A data de inicio nao pode ser posterior a data de fim.");

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) throw ApiError.notFound("Usuario nao encontrado.");

    const metas = await Meta.findAll({
      include: [
        {
          model: Usuario,
          as: "usuarios",
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
        },
        { model: MetaEtapa, as: "meta_etapas" },
        { model: Marca, as: "marca" },
      ],
      where: {
        data_inicio: { [Op.lte]: fim },
        data_fim: { [Op.gte]: inicio },
      },
      order: [["data_fim", "ASC"]],
    });

    const metasComAtual = await Promise.all(
      metas.map(async (meta) => {
        const detalhes = await VendaDetalhe.findAll({
          attributes: ["quantidade"],
          include: [
            {
              model: Venda,
              as: "venda",
              attributes: [],
              required: true,
              where: { funcionario_id: userId, data_venda: { [Op.gte]: meta.data_inicio, [Op.lte]: meta.data_fim }, situacao: true },
            },
            {
              model: Produto,
              as: "produto",
              attributes: [],
              required: true,
              where: { id_marca: meta.marcaId },
            },
          ],
        });
        const quantidade_atual = detalhes.reduce((total, d) => total + d.quantidade, 0);

        return { ...meta.toJSON(), quantidade_atual };
      })
    );

    return metasComAtual;
  }

  async listarTodas() {
    const metas = await Meta.findAll({
      include: [
        { model: Marca, as: "marca" },
        { model: MetaEtapa, as: "meta_etapas" },
        { model: Usuario, as: "usuarios", attributes: ["id", "nome"], through: { attributes: [] } },
      ],
      order: [["data_fim", "DESC"]],
    });
    return metas;
  }

  async getMetaComEtapas(metaId: number) {
    if (!metaId || metaId <= 0) throw ApiError.badRequest("ID da meta invalido.");

    const meta = await Meta.findByPk(metaId, {
      include: [
        { model: MetaEtapa, as: "meta_etapas" },
        { model: Marca, as: "marca" },
      ],
    });
    if (!meta) throw ApiError.notFound("Meta nao encontrada.");
    return meta;
  }

  async criarMeta(data: CreateMetaInput) {
    const { nome, marcaId, quantidade_objetivo, data_inicio, data_fim, usuarioIds, descricao, etapas = [] } = data;

    if (!nome?.trim()) throw ApiError.badRequest("Nome da meta e obrigatorio.");
    if (!Array.isArray(usuarioIds) || usuarioIds.length === 0) {
      throw ApiError.badRequest("Selecione ao menos um usuario.");
    }
    if (quantidade_objetivo <= 0) throw ApiError.badRequest("Quantidade-objetivo deve ser maior que zero.");

    const inicio = new Date(data_inicio);
    const fim = new Date(data_fim);
    if (isNaN(+inicio) || isNaN(+fim)) throw ApiError.badRequest("Datas invalidas.");
    if (inicio > fim) throw ApiError.badRequest("Data de inicio nao pode ser apos a data de fim.");
    fim.setHours(23, 59, 59, 0);

    const marca = await Marca.findByPk(marcaId);
    if (!marca) throw ApiError.badRequest("Marca nao encontrada.");

    let resolvedUserIds: number[];
    if (usuarioIds.includes(0)) {
      const todos = await Usuario.findAll({ where: { tipo_pessoa: TipoPessoa.EMPLOYEE }, attributes: ["id"] });
      resolvedUserIds = [...new Set(todos.map((u) => u.id))];
      if (resolvedUserIds.length === 0) throw ApiError.badRequest("Nenhum funcionario encontrado para atribuir a meta.");
    } else {
      const uniq = [...new Set(usuarioIds.filter((n) => Number.isFinite(n) && n > 0))];
      if (uniq.length === 0) throw ApiError.badRequest("Selecione ao menos um usuario valido.");

      const existentes = await Usuario.findAll({ where: { id: { [Op.in]: uniq } }, attributes: ["id"] });
      const ok = new Set(existentes.map((u) => u.id));
      const faltando = uniq.filter((id) => !ok.has(id));
      if (faltando.length) throw ApiError.badRequest(`Usuario(s) nao encontrado(s): ${faltando.join(", ")}`);
      resolvedUserIds = uniq;
    }

    try {
      return await sequelize.transaction(async (t) => {
        const novaMeta = await Meta.create(
          { nome, descricao: descricao ?? null, quantidade_objetivo, data_inicio: inicio, data_fim: fim, marcaId },
          { transaction: t }
        );

        await (novaMeta as any).setUsuarios(resolvedUserIds, { transaction: t });

        if (etapas.length) {
          await MetaEtapa.bulkCreate(
            etapas.map((et) => ({ meta_id: novaMeta.id, nome: et.nome, quantidade_objetivo: et.quantidade_objetivo })),
            { transaction: t }
          );
        }

        return this.getMetaComEtapas(novaMeta.id);
      });
    } catch (err: any) {
      if (err?.name === "SequelizeUniqueConstraintError") {
        throw ApiError.conflict("Ja existe uma meta com esse nome para a marca e data de inicio informados.");
      }
      if (err?.name === "SequelizeForeignKeyConstraintError") {
        throw ApiError.badRequest("Relacionamento invalido. Verifique se a marca e os usuarios existem.");
      }
      throw err;
    }
  }

  async deletarMeta(metaId: number) {
    if (!metaId || metaId <= 0) throw ApiError.badRequest("ID da meta invalido.");

    const meta = await Meta.findByPk(metaId);
    if (!meta) throw ApiError.notFound("Meta nao encontrada.");

    await sequelize.transaction(async (t) => {
      await MetaEtapa.destroy({ where: { meta_id: metaId }, transaction: t });
      await meta.destroy({ transaction: t });
    });

    return { id: metaId, mensagem: "Meta e etapas removidas com sucesso." };
  }
}

export default new MetaService();
