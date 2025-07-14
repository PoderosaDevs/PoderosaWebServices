// src/services/UsuarioService.ts
import { prisma } from "../database";
import { v4 } from "uuid";
import { UsuarioFiltroInput, UsuarioInput } from "../inputs/Usuario";
import { EmailValidation } from "../snippets/ValidationEmail";
import { HashPassword } from "../snippets/ValidationPassword";
import { GraphQLError } from "graphql";
import { TypePerson } from "../enums/TypePerson";
import { Prisma, type_person } from "@prisma/client";
import { startOfMonth, endOfMonth, parse, endOfDay } from "date-fns";
import { Pagination } from "../inputs/Utils";
import getPageInfo from "../helpers/getPageInfo";
import { PaginationInfo } from "../models/Utils";

class UsuarioService {
  async get(tipo_pessoa?: TypePerson) {
    // Construir o objeto de filtros dinamicamente
    const filters: Prisma.usuarioWhereInput = {
      situacao: true, // sempre filtrar usuários com situacao = true
      ...(tipo_pessoa ? { tipo_pessoa } : {}),
    };

    // Realizar a consulta com os filtros aplicados
    const users = await prisma.usuario.findMany({
      where: filters,
    });

    return users; // Retorne o array diretamente, sem encapsular em um objeto
  }

  async getUsersPoints(data?: UsuarioFiltroInput, pagination?: Pagination) {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }

    const parseDate = (dateStr: string) =>
      parse(dateStr, "dd/MM/yyyy", new Date());

    // Definir o intervalo de tempo, garantindo que `data` pode ser opcional
    const inicio = data?.startDate
      ? parseDate(data.startDate)
      : startOfMonth(new Date());
    const fim = data?.endDate
      ? parseDate(data.endDate)
      : endOfMonth(new Date());

    // Aplicar filtros de usuário (removendo a exigência de vendas)
    const filters: Prisma.usuarioWhereInput = {
      situacao: true, // Apenas usuários ativos
    };

    // Buscar todos os usuários, incluindo os que não fizeram vendas
    const usuarios = await prisma.usuario.findMany({
      where: filters,
      select: {
        id: true,
        nome: true,
        email: true,
        vendas: {
          where: {
            situacao: true,
            data_venda: {
              gte: inicio,
              lte: fim,
            },
          },
          select: {
            pontos_totais: true,
          },
        },
      },
      skip: pagina * quantidade,
      take: quantidade,
    });

    // Contagem total de usuários que atendem aos filtros
    const dataTotal = await prisma.usuario.count({ where: filters });

    // Paginação
    const DataPageInfo = getPageInfo(dataTotal, pagina, quantidade);

    // Mapear os usuários e calcular os pontos totais, garantindo que os que não venderam tenham 0 pontos
    return {
      result: usuarios.map((usuario) => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        pontos_totais:
          usuario.vendas.length > 0
            ? usuario.vendas.reduce(
                (total, venda) => total + venda.pontos_totais,
                0
              )
            : 0, // ✅ Define 0 para usuários sem vendas
      })),
      pageInfo: DataPageInfo,
    };
  }

  async getUserSalesById(
    userId: number,
    startDate?: string,
    endDate?: string,
    pagina: number = 0,
    quantidade: number = 10
  ) {
    console.log("➡️ Início da função getUserSalesById");

    const parseDate = (dateStr: string) =>
      parse(dateStr, "dd/MM/yyyy", new Date());

    const inicio = startDate ? parseDate(startDate) : startOfMonth(new Date());
    const fim = endDate
      ? endOfDay(parseDate(endDate))
      : endOfDay(endOfMonth(new Date()));

    console.log("📆 Filtro de datas:", { inicio, fim });

    const dataFilter = {
      data_venda: {
        gte: inicio,
        lte: fim,
      },
    };

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_pessoa: true,
      },
    });

    if (!usuario) {
      console.error("❌ Usuário não encontrado:", userId);
      throw new Error("Usuário não encontrado");
    }

    console.log("👤 Usuário encontrado:", usuario);

    const vendas = await prisma.venda.findMany({
      where: {
        funcionario_id: userId,
        ...dataFilter,
      },
      include: {
        loja: {
          select: {
            id: true,
            nome_fantasia: true,
          },
        },
        venda_detalhe: {
          include: {
            produto: {
              include: {
                marca: true,
              },
            },
          },
        },
      },
    });

    console.log("🧾 Vendas encontradas:", vendas.length);

    const dataTotal = await prisma.venda.count({
      where: {
        funcionario_id: userId,
        situacao: true,
        ...dataFilter,
      },
    });

    const pageInfo: PaginationInfo = {
      currentPage: pagina,
      totalPages: Math.ceil(dataTotal / quantidade),
      totalItems: dataTotal,
      hasNextPage: pagina * quantidade + quantidade < dataTotal,
      hasPreviousPage: pagina > 0,
    };

    if (!vendas || vendas.length === 0) {
      console.warn("⚠️ Nenhuma venda encontrada");
      return {
        result: {
          ...usuario,
          pontos_totais: 0,
          pontos_totais_tratamento: 0,
          pontos_totais_coloracao: 0,
          marcas: [],
          lojas: [],
        },
        pageInfo,
      };
    }

    let pontos_totais = 0;
    let pontos_totais_tratamento = 0;
    let pontos_totais_coloracao = 0;

    const marcasMap = new Map();
    const lojasMap = new Map();

    for (const venda of vendas) {
      let totalVenda = 0;
      let pontosTratamentoVenda = 0;
      let pontosColoracaoVenda = 0;

      for (const detalhe of venda.venda_detalhe) {
        const qtd = detalhe.quantidade;
        const nomeProduto = detalhe.produto?.nome ?? "";

        pontos_totais += qtd;
        totalVenda += qtd;

        const isTratamento = nomeProduto.startsWith("T ");
        const isColoracao = nomeProduto.startsWith("C ");

        if (isTratamento) {
          pontos_totais_tratamento += qtd;
          pontosTratamentoVenda += qtd;
        } else if (isColoracao) {
          pontos_totais_coloracao += qtd;
          pontosColoracaoVenda += qtd;
        }

        const marca = detalhe.produto?.marca;
        if (marca) {
          if (!marcasMap.has(marca.id)) {
            marcasMap.set(marca.id, {
              id: marca.id,
              nome: marca.nome,
              quantidade: 0,
              pontos_tratamento: 0,
              pontos_coloracao: 0,
            });
          }

          const marcaData = marcasMap.get(marca.id)!;
          marcaData.quantidade += qtd;
          if (isTratamento) {
            marcaData.pontos_tratamento += qtd;
          } else if (isColoracao) {
            marcaData.pontos_coloracao += qtd;
          }
        }
      }

      const loja = venda.loja;
      if (loja) {
        if (!lojasMap.has(loja.id)) {
          lojasMap.set(loja.id, {
            id: loja.id,
            nome: loja.nome_fantasia ?? "Loja sem nome",
            quantidade: 0,
            pontos_tratamento: 0,
            pontos_coloracao: 0,
          });
        }

        const lojaData = lojasMap.get(loja.id)!;
        lojaData.quantidade += totalVenda;
        lojaData.pontos_tratamento += pontosTratamentoVenda;
        lojaData.pontos_coloracao += pontosColoracaoVenda;
      }
    }

    console.log("✅ Totais calculados:", {
      pontos_totais,
      pontos_totais_tratamento,
      pontos_totais_coloracao,
    });

    if (!vendas || vendas.length === 0 || pontos_totais === 0) {
      console.warn("⚠️ Vendas vazias ou pontos totais zerados");
      return {
        result: {
          ...usuario,
          pontos_totais: 0,
          pontos_totais_tratamento: 0,
          pontos_totais_coloracao: 0,
          marcas: [],
          lojas: [],
        },
        pageInfo,
      };
    }

    const result = {
      ...usuario,
      pontos_totais,
      pontos_totais_tratamento,
      pontos_totais_coloracao,
      marcas: Array.from(marcasMap.values()),
      lojas: Array.from(lojasMap.values()),
    };

    console.log("✅ Resultado final montado", result);

    return {
      result,
      pageInfo,
    };
  }

  async getRankingUserSales(
    startDate?: string,
    endDate?: string,
    pagina: number = 0,
    quantidade: number = 10
  ) {
    const parseDate = (dateStr: string) =>
      parse(dateStr, "dd/MM/yyyy", new Date());

    const inicio = startDate ? parseDate(startDate) : startOfMonth(new Date());
    const fim = endDate ? parseDate(endDate) : endOfMonth(new Date());

    // Buscar apenas usuários EMPLOYEE
    const usuarios = await prisma.usuario.findMany({
      where: {
        tipo_pessoa: "EMPLOYEE",
      },
      skip: pagina * quantidade,
      take: quantidade,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo_pessoa: true,
        vendas: {
          where: {
            situacao: true,
            data_venda: {
              gte: inicio,
              lte: fim,
            },
          },
          select: {
            venda_detalhe: {
              select: {
                quantidade: true,
              },
            },
          },
        },
      },
    });

    // Contagem total de usuários EMPLOYEE para paginação
    const dataTotal = await prisma.usuario.count({
      where: {
        tipo_pessoa: "EMPLOYEE",
      },
    });

    const pageInfo = getPageInfo(dataTotal, pagina, quantidade);

    // Calcular pontos (sem filtrar os que têm 0)
    const result = usuarios.map((usuario) => {
      const pontos_totais = usuario.vendas.reduce((total, venda) => {
        return (
          total +
          venda.venda_detalhe.reduce((soma, vd) => soma + vd.quantidade, 0)
        );
      }, 0);

      return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_pessoa: usuario.tipo_pessoa,
        pontos_totais,
      };
    });

    return {
      result,
      pageInfo,
    };
  }

  async getByID(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id },
    });

    return { result: user };
  }

  async create(data: UsuarioInput, tipo: type_person) {
    // Valida o e-mail
    const DataUser = await EmailValidation(data.email);

    if (DataUser.emailValid) {
      throw new GraphQLError("Email já cadastrado no sistema!");
    }

    const uuid = v4(); // Gera o UUID para o novo usuário

    // Criptografa a senha
    const hashedPassword = await HashPassword(data.senha, 10);

    // Cria o usuário e associa os tipos de sistema
    const user = await prisma.usuario.create({
      data: {
        senha: hashedPassword,
        email: data.email,
        cpf: data.cpf,
        data_nascimento: data.data_nascimento,
        nome: data.nome,
        funcao: data.funcao,
        tipo_pessoa: tipo || "EMPLOYEE", // Valor padrão se tipo_pessoa não for fornecido
        uuid,
        usuario_foto: data.usuario_foto || "", // Valor padrão se usuario_foto não for fornecido
        situacao: true,
        created_at: new Date(),
      },
    });

    return user;
  }

  async update(id: number, data: UsuarioInput, tipo: type_person) {
    // Verifica se o e-mail foi alterado
    if (data.email) {
      const DataUser = await EmailValidation(data.email);

      if (DataUser.emailValid) {
        throw new GraphQLError("Email já cadastrado no sistema!");
      }
    }

    // Caso a senha tenha sido fornecida, criptografa a nova senha
    let updatedData: any = { ...data }; // Faz uma cópia dos dados fornecidos

    if (data.senha) {
      const hashedPassword = await HashPassword(data.senha, 10);
      updatedData.senha = hashedPassword; // Atualiza a senha criptografada
    }

    // Caso o tipo de pessoa não tenha sido fornecido, define o padrão "EMPLOYEE"
    updatedData.tipo_pessoa = tipo || "EMPLOYEE";

    // Atualiza o usuário
    const user = await prisma.usuario.update({
      where: { id },
      data: updatedData,
    });

    return user;
  }

  async delete(id: number, tipo: type_person) {
    if (tipo === "EMPLOYEE") {
      throw new GraphQLError(
        "Você não tem permissão para desativar o usuário!"
      );
    }

    const userToDelete = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      throw new GraphQLError("Usuário não encontrado!");
    }

    const user = await prisma.usuario.update({
      where: { id },
      data: { situacao: false }, // Desativa o usuário
    });

    return { message: "Usuário desativado com sucesso!", user };
  }
}

export default new UsuarioService();
