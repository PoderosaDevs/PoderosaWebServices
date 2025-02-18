// src/services/UsuarioService.ts
import { prisma } from "../database";
import { v4 } from "uuid";
import { UsuarioInput } from "../inputs/Usuario";
import { EmailValidation } from "../snippets/ValidationEmail";
import { HashPassword } from "../snippets/ValidationPassword";
import { GraphQLError } from "graphql";
import { TypePerson } from "../enums/TypePerson";
import { Prisma, type_person } from "@prisma/client";


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
