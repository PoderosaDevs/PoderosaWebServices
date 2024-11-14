import { v4 } from "uuid";
import { GraphQLError } from 'graphql';
import { prisma } from "../../database";
import { FuncionarioInput } from "../../inputs/estoque/Usuario";
import { EmailValidation } from "../../snippets/ValidationEmail";
import { HashPassword } from "../../snippets/ValidationPassword";

class FuncionarioService {
  // Obtém todos os funcionários ativos associados ao sistema 'ESTOQUE'
  async get() {
    const usuarios = await prisma.usuario.findMany({
      where: {
        situacao: true,
        tipo_pessoa: 'EMPLOYEE',
        tipo_sistemas: {
          some: {
            tipo_sistema: {
              nome: 'ESTOQUE'
            }
          }
        }
      }
    });
    return usuarios; // Retorna o array diretamente, sem encapsular em um objeto
  }

  async getStock() {
    const usuarios = await prisma.usuario.findMany({
      include: {
        dia_trabalhado_estoque: true
      },
      where: {
        situacao: true,
        tipo_pessoa: 'EMPLOYEE',
        tipo_sistemas: {
          some: {
            tipo_sistema: {
              nome: 'ESTOQUE'
            }
          }
        }
      }
    });

    return usuarios; 
  }


  async getByID(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id },
      include: {
        tipo_sistemas: {
          where: {
            tipo_sistema: {
              nome: 'ESTOQUE'  // Filtra os tipos de sistema para trazer apenas os de nome 'ESTOQUE'
            }
          }
        },
        dia_trabalhado_estoque: true, // Inclui o campo dia_trabalhado_estoque
      }
    });
  
    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }
  
    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }
  
    if (user.tipo_sistemas.length === 0) {
      throw new GraphQLError("Usuário não está associado ao sistema 'ESTOQUE'.");
    }
  
    return user ;
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

    // Verifica se o tipo de sistema 'ESTOQUE' existe
    const tipoSistema = await prisma.tipo_sistema.findUnique({
      where: { nome: 'ESTOQUE' }
    });

    if (!tipoSistema) {
      throw new GraphQLError("Tipo de sistema 'ESTOQUE' não encontrado.");
    }

    // Cria o usuário e associa-o ao tipo de sistema 'ESTOQUE'
    const user = await prisma.usuario.create({
      data: {
        ...data,
        uuid,
        usuario_foto: "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
        senha: hashedPassword, // Renomeado para 'senha' conforme o esquema
        situacao: true, // Define a situação como true por padrão
        created_at: new Date(), // Define a data de criação
        tipo_pessoa: 'EMPLOYEE', // Define o tipo de pessoa como 'EMPLOYEE'
        is_whatsapp: false, 
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

  // Atualiza um usuário existente, garantindo que ele seja um funcionário
  async update(id: number, data: object) {
    const user = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }

    const updatedUser = await prisma.usuario.update({
      where: { id },
      data
    });

    return updatedUser;
  }

  // Deleta um usuário (define a situação como inativa), garantindo que ele seja um funcionário
  async delete(id: number) {
    const user = await prisma.usuario.findUnique({
      where: { id }
    });

    if (!user) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    if (user.tipo_pessoa !== 'EMPLOYEE') {
      throw new GraphQLError("Usuário não é um funcionário.");
    }

    const deletedUser = await prisma.usuario.update({
      where: { id },
      data: { situacao: false }
    });

    return deletedUser;
  }
}

export default new FuncionarioService();
