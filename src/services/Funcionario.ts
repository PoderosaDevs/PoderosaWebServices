// src/services/UsuarioService.ts
import { v4 } from "uuid";
import { GraphQLError } from 'graphql';
import { prisma } from "../database";
import { FuncionarioInput } from "../inputs/estoque/Usuario";
import { EmailValidation } from "../snippets/ValidationEmail";
import { HashPassword } from "../snippets/ValidationPassword";

class FuncionarioService {
  async get() {
    const employees = await prisma.user.findMany({
      where: { situacao: true, type_person:'EMPLOYEE' },
    });
    return employees; // Retorne o array diretamente, sem encapsular em um objeto
  }


  async getByID(id: number) {
    const employee = await prisma.user.findUnique({
      where: { id, type_person:'EMPLOYEE' },
    });

    return { result: employee };
  }

  async create(data: FuncionarioInput) {
    const DataUser = await EmailValidation(data.email);

    if (DataUser.emailValid) {
      throw new GraphQLError("Email já cadastrado no sistema!");
    }

    const uuid = v4(); // Gera o UUID para o novo usuário

    // Criptografa a senha
    const hashedPassword = await HashPassword(data.password, 10)

    const employee = await prisma.user.create({
      data: {
        ...data,
        uuid,
        password: hashedPassword,
        situacao: true, // Define a situação como true por padrão
        created_at: new Date(), // Define a data de criação
        type_person: 'EMPLOYEE'
      },
    });

    return employee;
  }

  async update(id: number, data: object) {
    const employee = await prisma.user.update({
      where: { id, type_person: 'EMPLOYEE' },
      data,
    });

    return employee;
  }

  async delete(id: number) {
    const employee = await prisma.user.update({
      where: { id, type_person: 'EMPLOYEE' },
      data: { situacao: false },
    });

    return employee;
  }

}

export default new FuncionarioService();
