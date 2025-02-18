import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { AutenticacaoModel } from "../models/Autenticacao";
import { AutenticacaoInput } from "../inputs/Autenticacao";
import { EmailValidation } from "../snippets/ValidationEmail";
import { GraphQLError } from "graphql";
import { PasswordValidation } from "../snippets/ValidationPassword";
import { address } from "ip";
import jwt from "jsonwebtoken";
import { prisma } from "../database";

@Resolver()
export class AutenticacaoResolver {
  @UseMiddleware()
  @Mutation(() => AutenticacaoModel)
  async Login(@Arg("usuario") usuario: AutenticacaoInput) {
    const DataUser = await EmailValidation(usuario.email);

    if (!DataUser.emailValid) {
      throw new GraphQLError("Usuário não existe!");
    }

    if (!DataUser.data) {
      throw new GraphQLError("Erro ao recuperar dados do usuário.");
    }

    const passwordValid = await PasswordValidation(usuario.senha, DataUser.data.senha);

    if (!passwordValid) {
      throw new GraphQLError("Senha Inválida!");
    }

    const authSecret = process.env.AUTH_SECRET;

    if (!authSecret) {
      throw new Error('AUTH_SECRET is not defined in environment variables.');
    }


    DataUser.data.token_api = jwt.sign(
      {
        nome: DataUser.data.nome,
        email: DataUser.data.email,
        funcao: DataUser.data.funcao,
        tipo_usuario: DataUser.data.tipo_pessoa,
        complemento: DataUser.data.complemento,
        cpf: DataUser.data.cpf,
        data_nascimento: DataUser.data.data_nascimento,
        id: DataUser.data.id,
        ip: address(),
      },
      authSecret,
      { expiresIn: "2d" }
    );


    return {
      ...DataUser.data,
      tipo_pessoa: DataUser.data.tipo_pessoa,
    };
  }

}