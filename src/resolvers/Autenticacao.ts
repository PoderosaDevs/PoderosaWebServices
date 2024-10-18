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

    // Obtenha os tipos de sistema associados ao usuário
    const tiposSistemas = await prisma.usuario_tipo_sistema.findMany({
      where: { id_usuario: DataUser.data.id },
      include: { tipo_sistema: true }
    });

    const systemNames = tiposSistemas.map(ts => ts.tipo_sistema.nome);


    DataUser.data.token_api = jwt.sign(
      {
        nome: DataUser.data.nome,
        email: DataUser.data.email,
        funcao: DataUser.data.funcao,
        tipo_usuario: DataUser.data.tipo_pessoa,
        tipo_sistemas: systemNames,
        complemento: DataUser.data.complemento,
        cpf: DataUser.data.cpf,
        data_nascimento: DataUser.data.data_nascimento,
        endereco: DataUser.data.endereco,
        is_whatsapp: DataUser.data.is_whatsapp,
        numero: DataUser.data.numero,
        telefone: DataUser.data.telefone,
        cep: DataUser.data.cep,
        id: DataUser.data.id,
        ip: address(),
      },
      authSecret,
      { expiresIn: "1m" }
    );


    return {
      ...DataUser.data,
      tipo_pessoa: DataUser.data.tipo_pessoa,
      tipos_sistemas: systemNames
    };
  }

}