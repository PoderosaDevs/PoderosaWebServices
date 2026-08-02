import { v4 as uuidv4 } from "uuid";
import { Op, WhereOptions } from "sequelize";
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth } from "date-fns";
import { Marca, Produto, Usuario, Venda, VendaDetalhe, Loja } from "../database/models";
import { ApiError } from "../utils/apiError";
import { comparePassword, hashPassword } from "../utils/password";
import { buildPageInfo, parsePagination } from "../utils/pagination";
import { parseDateBr, resolvePeriodo } from "../utils/date";
import { TipoPessoa } from "../types/enums";

export enum InsightTargetType {
  USER = "USER",
  STORE = "STORE",
  BRAND = "BRAND",
}

interface UsuarioInput {
  senha?: string;
  email: string;
  tema?: string;
  cpf?: string;
  data_nascimento?: Date;
  nome: string;
  funcao?: string;
  usuario_foto?: string;
  tipo_pessoa?: TipoPessoa;
  complemento?: string;
}

class UsuarioService {
  async get(tipo_pessoa?: TipoPessoa) {
    const where: WhereOptions = { situacao: true, ...(tipo_pessoa ? { tipo_pessoa } : {}) };
    return Usuario.findAll({ where, order: [["nome", "ASC"]] });
  }

  async getByID(id: number) {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw ApiError.notFound("Usuario nao encontrado.");
    return usuario;
  }

  async getUsersPoints(startDate?: string, endDate?: string, pagination?: { pagina?: number; quantidade?: number }) {
    const { pagina, quantidade } = parsePagination(pagination ?? {});
    const inicio = startDate ? parseDateBr(startDate) : startOfMonth(new Date());
    const fim = endDate ? parseDateBr(endDate) : endOfMonth(new Date());

    const { rows: usuarios, count: dataTotal } = await Usuario.findAndCountAll({
      where: { situacao: true },
      include: [
        {
          model: Venda,
          as: "vendas",
          required: false,
          where: { situacao: true, data_venda: { [Op.gte]: inicio, [Op.lte]: fim } },
          attributes: ["pontos_totais"],
        },
      ],
      offset: pagina * quantidade,
      limit: quantidade,
      distinct: true,
    });

    return {
      result: usuarios.map((usuario) => {
        const vendas = (usuario.get("vendas") as Venda[] | undefined) ?? [];
        return {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          pontos_totais: vendas.reduce((total, venda) => total + Number(venda.pontos_totais), 0),
        };
      }),
      pageInfo: buildPageInfo(dataTotal, pagina, quantidade),
    };
  }

  async getRankingUserSales(startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const inicio = startDate ? parseDateBr(startDate) : startOfMonth(new Date());
    const fim = endDate ? parseDateBr(endDate) : endOfMonth(new Date());

    const { rows: usuarios, count: dataTotal } = await Usuario.findAndCountAll({
      where: { tipo_pessoa: TipoPessoa.EMPLOYEE },
      include: [
        {
          model: Venda,
          as: "vendas",
          required: false,
          where: { situacao: true, data_venda: { [Op.gte]: inicio, [Op.lte]: fim } },
          include: [{ model: VendaDetalhe, as: "venda_detalhe", attributes: ["quantidade"] }],
        },
      ],
      offset: pagina * quantidade,
      limit: quantidade,
      distinct: true,
    });

    const result = usuarios.map((usuario) => {
      const vendas = (usuario.get("vendas") as Venda[] | undefined) ?? [];
      const pontos_totais = vendas.reduce((total, venda) => {
        const detalhes = (venda.get("venda_detalhe") as VendaDetalhe[] | undefined) ?? [];
        return total + detalhes.reduce((soma, vd) => soma + vd.quantidade, 0);
      }, 0);

      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_pessoa: usuario.tipo_pessoa,
        pontos_totais,
      };
    });

    result.sort((a, b) => b.pontos_totais - a.pontos_totais);

    return { result, pageInfo: buildPageInfo(dataTotal, pagina, quantidade) };
  }

  async getUserSalesById(userId: number, startDate?: string, endDate?: string, pagina = 0, quantidade = 10) {
    const inicio = startDate ? startOfDay(parseDateBr(startDate)) : startOfMonth(new Date());
    const fim = endDate ? endOfDay(parseDateBr(endDate)) : endOfDay(endOfMonth(new Date()));

    const usuario = await Usuario.findByPk(userId, {
      attributes: ["id", "nome", "email", "tipo_pessoa"],
    });
    if (!usuario) throw ApiError.notFound("Usuario nao encontrado");

    const whereVenda = {
      funcionario_id: userId,
      data_venda: { [Op.gte]: inicio, [Op.lte]: fim },
      situacao: true,
    };

    const [dataTotal, vendas] = await Promise.all([
      Venda.count({ where: whereVenda }),
      Venda.findAll({
        where: whereVenda,
        include: [
          { model: Loja, as: "loja", attributes: ["id", "nome_fantasia"] },
          {
            model: VendaDetalhe,
            as: "venda_detalhe",
            attributes: ["quantidade"],
            include: [
              {
                model: Produto,
                as: "produto",
                attributes: ["nome"],
                include: [{ model: Marca, as: "marca", attributes: ["id", "nome"] }],
              },
            ],
          },
        ],
      }),
    ]);

    const stats = {
      pontos_totais: 0,
      pontos_totais_tratamento: 0,
      pontos_totais_coloracao: 0,
      marcasMap: new Map<number, any>(),
      lojasMap: new Map<number, any>(),
    };

    for (const venda of vendas) {
      let totalVenda = 0;
      let pontosTratamentoVenda = 0;
      let pontosColoracaoVenda = 0;
      const detalhes = (venda.get("venda_detalhe") as any[]) ?? [];

      for (const detalhe of detalhes) {
        const qtd = detalhe.quantidade as number;
        const produto = detalhe.produto;
        const nome = (produto?.nome ?? "").toUpperCase();
        const marca = produto?.marca;

        const isTratamento = nome.startsWith("T ");
        const isColoracao = nome.startsWith("C ");

        stats.pontos_totais += qtd;
        totalVenda += qtd;
        if (isTratamento) {
          stats.pontos_totais_tratamento += qtd;
          pontosTratamentoVenda += qtd;
        } else if (isColoracao) {
          stats.pontos_totais_coloracao += qtd;
          pontosColoracaoVenda += qtd;
        }

        if (marca) {
          const mData =
            stats.marcasMap.get(marca.id) ??
            { id: marca.id, nome: marca.nome, quantidade: 0, pontos_tratamento: 0, pontos_coloracao: 0 };
          mData.quantidade += qtd;
          if (isTratamento) mData.pontos_tratamento += qtd;
          if (isColoracao) mData.pontos_coloracao += qtd;
          stats.marcasMap.set(marca.id, mData);
        }
      }

      const loja = venda.get("loja") as any;
      if (loja) {
        const lData =
          stats.lojasMap.get(loja.id) ??
          { id: loja.id, nome: loja.nome_fantasia ?? "Loja sem nome", quantidade: 0, pontos_tratamento: 0, pontos_coloracao: 0 };
        lData.quantidade += totalVenda;
        lData.pontos_tratamento += pontosTratamentoVenda;
        lData.pontos_coloracao += pontosColoracaoVenda;
        stats.lojasMap.set(loja.id, lData);
      }
    }

    return {
      result: {
        ...usuario.toJSON(),
        pontos_totais: stats.pontos_totais,
        pontos_totais_tratamento: stats.pontos_totais_tratamento,
        pontos_totais_coloracao: stats.pontos_totais_coloracao,
        marcas: Array.from(stats.marcasMap.values()).sort((a, b) => b.quantidade - a.quantidade),
        lojas: Array.from(stats.lojasMap.values()).sort((a, b) => b.quantidade - a.quantidade),
      },
      pageInfo: buildPageInfo(dataTotal, pagina, quantidade),
    };
  }

  async create(data: UsuarioInput, tipo: TipoPessoa) {
    const existente = await Usuario.findOne({ where: { email: data.email, situacao: true } });
    if (existente) {
      throw ApiError.conflict("Email ja cadastrado no sistema!");
    }
    if (!data.senha) {
      throw ApiError.badRequest("Senha obrigatoria.");
    }

    const senhaCriptografada = await hashPassword(data.senha);

    return Usuario.create({
      uuid: uuidv4(),
      senha: senhaCriptografada,
      email: data.email,
      cpf: data.cpf ?? null,
      data_nascimento: data.data_nascimento ?? null,
      nome: data.nome,
      funcao: data.funcao ?? null,
      tipo_pessoa: tipo || TipoPessoa.EMPLOYEE,
      usuario_foto: data.usuario_foto ?? "",
      tema: data.tema ?? null,
      complemento: data.complemento ?? null,
      situacao: true,
    });
  }

  // Campos que uma vendedora pode alterar no proprio perfil. Nome, CPF,
  // e-mail, funcao e tipo_pessoa continuam exigindo ADMIN/MANAGER - evita
  // que o proprio usuario se promova de cargo ou troque o e-mail de login.
  private static SELF_EDITABLE_FIELDS: (keyof UsuarioInput)[] = [
    "data_nascimento",
    "usuario_foto",
    "tema",
    "complemento",
  ];

  async update(id: number, data: Partial<UsuarioInput>, tipo?: TipoPessoa, privileged = true) {
    const usuario = await this.getByID(id);

    const input = privileged
      ? data
      : Object.fromEntries(
          Object.entries(data).filter(([key]) =>
            UsuarioService.SELF_EDITABLE_FIELDS.includes(key as keyof UsuarioInput)
          )
        );

    if (input.email && input.email !== usuario.email) {
      const existente = await Usuario.findOne({ where: { email: input.email, situacao: true } });
      if (existente) {
        throw ApiError.conflict("Email ja cadastrado no sistema!");
      }
    }

    const updatedData: Record<string, unknown> = { ...input, updated_at: new Date() };
    if (privileged && data.senha) {
      updatedData.senha = await hashPassword(data.senha);
    } else {
      delete updatedData.senha;
    }
    if (privileged && tipo) updatedData.tipo_pessoa = tipo;

    await usuario.update(updatedData);
    return usuario;
  }

  async changeOwnPassword(id: number, senhaAtual: string, novaSenha: string) {
    const usuario = await this.getByID(id);
    const confere = await comparePassword(senhaAtual, usuario.senha);
    if (!confere) {
      throw ApiError.badRequest("Senha atual incorreta.");
    }
    const senhaCriptografada = await hashPassword(novaSenha);
    await usuario.update({ senha: senhaCriptografada, updated_at: new Date() });
    return { message: "Senha atualizada com sucesso!" };
  }

  async delete(id: number, tipoSolicitante: TipoPessoa) {
    if (tipoSolicitante === TipoPessoa.EMPLOYEE) {
      throw ApiError.forbidden("Voce nao tem permissao para desativar o usuario!");
    }

    const usuario = await this.getByID(id);
    await usuario.update({ situacao: false, updated_at: new Date() });
    return { message: "Usuario desativado com sucesso!", usuario };
  }

  async recovery(id: number, novaSenha: string) {
    const usuario = await this.getByID(id);
    const senhaCriptografada = await hashPassword(novaSenha);
    await usuario.update({ senha: senhaCriptografada, updated_at: new Date() });
    return { message: "Senha atualizada com sucesso!" };
  }

  async vendasPeriodos(
    targetId: number,
    startDate?: string,
    endDate?: string,
    type: InsightTargetType = InsightTargetType.USER
  ) {
    const { inicio, fim } = resolvePeriodo(startDate, endDate);

    const whereVenda: Record<string, unknown> = {
      situacao: true,
      data_venda: { [Op.gte]: inicio, [Op.lte]: fim },
    };

    if (type === InsightTargetType.STORE) {
      whereVenda.loja_id = targetId;
    } else if (type === InsightTargetType.USER) {
      whereVenda.funcionario_id = targetId;
    }

    const detalheInclude: any = {
      model: VendaDetalhe,
      as: "venda_detalhe",
      include: [{ model: Produto, as: "produto", attributes: ["nome", "id_marca"] }],
    };

    if (type === InsightTargetType.BRAND) {
      detalheInclude.include[0].where = { id_marca: targetId };
      detalheInclude.required = true;
    }

    const vendas = await Venda.findAll({ where: whereVenda, include: [detalheInclude] });

    const mapa: Record<string, { tratamentos: number; coloracoes: number }> = {};

    for (const venda of vendas) {
      const key = format(venda.data_venda, "yyyy-MM-dd");
      if (!mapa[key]) mapa[key] = { tratamentos: 0, coloracoes: 0 };

      const detalhes = (venda.get("venda_detalhe") as any[]) ?? [];
      for (const det of detalhes) {
        if (type === InsightTargetType.BRAND && det.produto?.id_marca !== targetId) continue;

        const nomeProduto = String(det.produto?.nome ?? "").trim().toUpperCase();
        const quantidade = Number(det.quantidade ?? 0);

        if (nomeProduto.startsWith("T ")) mapa[key].tratamentos += quantidade;
        else if (nomeProduto.startsWith("C ")) mapa[key].coloracoes += quantidade;
      }
    }

    return Object.keys(mapa)
      .sort()
      .map((key) => {
        const bucket = mapa[key];
        const [year, month, day] = key.split("-").map(Number);
        const dataFmt = format(new Date(year, month - 1, day), "dd/MM/yyyy");
        return {
          data: dataFmt,
          categories: [
            { title: "tratamentos", value: bucket.tratamentos },
            { title: "coloracoes", value: bucket.coloracoes },
          ],
        };
      });
  }
}

export default new UsuarioService();
