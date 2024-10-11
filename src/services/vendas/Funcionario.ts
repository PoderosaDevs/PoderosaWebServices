import { v4 } from "uuid";
import { GraphQLError } from 'graphql';
import { prisma } from "../../database";
import { FuncionarioInput } from "../../inputs/estoque/Usuario";
import { EmailValidation } from "../../snippets/ValidationEmail";
import { HashPassword } from "../../snippets/ValidationPassword";

class FuncionarioService {
  // Obtém todos os funcionários ativos associados ao sistema 'SALES'
  async get() {
    const usuarios = await prisma.usuario.findMany({
      where: {
        situacao: true,
        tipo_pessoa: 'EMPLOYEE',
        tipo_sistemas: {
          some: {
            tipo_sistema: {
              nome: 'SALES'
            }
          }
        }
      }
    });
    return usuarios; // Retorna o array diretamente, sem encapsular em um objeto
  }

  async getByID(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        tipo_sistemas: {
          where: {
            tipo_sistema: {
              nome: 'SALES'
            }
          }
        }
      }
    });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }

    if (user.tipo_sistemas.length === 0) {
      throw new GraphQLError("Usuário não está associado ao sistema 'SALES'.");
    }

    return { result: user };
  }

  async create(data: FuncionarioInput) {
    // Valida se o email já está cadastrado
    const DataUser = await EmailValidation(data.email);
    if (!DataUser.emailValid) {
      throw new GraphQLError("Email já cadastrado no sistema!");
    }

    const uuid = v4(); // Gera o UUID para o novo usuário

    // Criptografa a senha
    const hashedPassword = await HashPassword(data.senha, 10);

    // Verifica se o tipo de sistema 'SALES' existe
    const tipoSistema = await prisma.tipo_sistema.findUnique({
      where: { nome: 'SALES' }
    });

    if (!tipoSistema) {
      throw new GraphQLError("Tipo de sistema 'SALES' não encontrado.");
    }

    // Cria o usuário e associa-o ao tipo de sistema 'SALES'
    const user = await prisma.usuario.create({
      data: {
        ...data,
        uuid,
        usuario_foto: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
        senha: hashedPassword, // Renomeado para 'senha' conforme o esquema
        situacao: true, // Define a situação como true por padrão
        created_at: new Date(), // Define a data de criação
        tipo_pessoa: 'EMPLOYEE', // Define o tipo de pessoa como 'EMPLOYEE'
        tipo_sistemas: {
          create: {
            tipo_sistema: {
              connect: { id: tipoSistema.id } // Conecta ao tipo de sistema existente
            }
          }
        }
      }
    });

    return user;
  }

  // Atualiza um usuário existente, garantindo que ele seja um funcionário e esteja associado ao sistema 'SALES'
  async update(id: number, data: object) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        tipo_sistemas: {
          where: {
            tipo_sistema: {
              nome: 'SALES'
            }
          }
        }
      }
    });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }

    if (user.tipo_sistemas.length === 0) {
      throw new GraphQLError("Usuário não está associado ao sistema 'SALES'.");
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data
    });

    return updatedUser;
  }

  // Deleta um usuário (define a situação como inativa), garantindo que ele seja um funcionário e esteja associado ao sistema 'SALES'
  async delete(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        tipo_sistemas: {
          where: {
            tipo_sistema: {
              nome: 'SALES'
            }
          }
        }
      }
    });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }

    if (user.tipo_sistemas.length === 0) {
      throw new GraphQLError("Usuário não está associado ao sistema 'SALES'.");
    }

    const deletedUser = await prisma.usuario.update({
      where: { id },
      data: { situacao: false }
    });

    return deletedUser;
  }
}

export default new FuncionarioService();
