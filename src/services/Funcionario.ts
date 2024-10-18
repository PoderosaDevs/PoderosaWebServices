// src/services/UsuarioService.ts
import { v4 } from "uuid";
import { GraphQLError } from 'graphql';
import { prisma } from "../database";
import { FuncionarioInput } from "../inputs/estoque/Usuario";
import { EmailValidation } from "../snippets/ValidationEmail";
import { HashPassword } from "../snippets/ValidationPassword";
import { sendWelcomeEmail } from "../snippets/Nodemailer";

class FuncionarioService {
  async get() {
    const employees = await prisma.usuario.findMany({
      where: { situacao: true, tipo_pessoa: 'EMPLOYEE' },
    });
    return employees; // Retorna o array diretamente, sem encapsular em um objeto
  }

  async getByID(id: number) {
    const employee = await prisma.usuario.findUnique({
      where: { id, tipo_pessoa: 'EMPLOYEE' },
    });

    return { result: employee };
  }

  async create(data: FuncionarioInput) {
    const DataUser = await EmailValidation(data.email);

    if (!DataUser.emailValid) { // Corrigido para verificar se o email é válido
      throw new GraphQLError("Email já cadastrado no sistema!");
    }

    const uuid = v4(); // Gera o UUID para o novo usuário

    // Criptografa a senha
    const hashedPassword = await HashPassword(data.senha, 10);

    const employee = await prisma.usuario.create({
      data: {
        ...data,
        uuid,
        senha: hashedPassword,
        situacao: true, // Define a situação como true por padrão
        created_at: new Date(), // Define a data de criação
        tipo_pessoa: 'EMPLOYEE',
      },
    });

    // Enviar email de boas-vindas
    await sendWelcomeEmail(employee.email, data.nome || "Novo Funcionário"); // Substitua 'data.nome' se necessário

    return employee;
  }

  async update(id: number, data: object) {
    const employee = await prisma.usuario.update({
      where: { id, tipo_pessoa: 'EMPLOYEE' },
      data,
    });

    return employee;
  }

  async delete(id: number) {
    const employee = await prisma.usuario.update({
      where: { id, tipo_pessoa: 'EMPLOYEE' },
      data: { situacao: false },
    });

    return employee;
  }
}

export default new FuncionarioService();
