// src/services/UsuarioService.ts
import { prisma } from "../database";
import { v4 } from "uuid";
import { UsuarioFiltroInput, UsuarioInput } from "../inputs/Usuario";
import { EmailValidation } from "../snippets/ValidationEmail";
import { HashPassword } from "../snippets/ValidationPassword";
import { GraphQLError } from "graphql";
import { TypePerson } from "../enums/TypePerson";
import { Prisma, type_person } from "@prisma/client";
import { startOfMonth, endOfMonth } from "date-fns";
import { Pagination } from "../inputs/Utils";
import getPageInfo from "../helpers/getPageInfo";

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
  
    // Definir o intervalo de tempo, garantindo que `data` pode ser opcional
    const inicio = data?.data_inicio
      ? new Date(data.data_inicio)
      : startOfMonth(new Date());
  
    const fim = data?.data_fim
      ? new Date(data.data_fim)
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
        pontos_totais: usuario.vendas.length > 0
          ? usuario.vendas.reduce((total, venda) => total + venda.pontos_totais, 0)
          : 0, // ✅ Define 0 para usuários sem vendas
      })),
      pageInfo: DataPageInfo,
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
