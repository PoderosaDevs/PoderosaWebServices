// src/services/UsuarioService.ts
import { prisma } from '../database';
import { v4 } from "uuid";  
import { UsuarioInput } from '../inputs/Usuario';
import { EmailValidation } from '../snippets/ValidationEmail';
import { HashPassword } from '../snippets/ValidationPassword';
import { GraphQLError } from 'graphql';
import { TypePerson } from '../enums/TypePerson';
import { TypeSystem } from '../enums/TypeSystem';
import { Prisma } from '@prisma/client';

// src/types/User.ts
export type User = {
  id: string;
  api_token?: string;
  password: string;
  email: string;

  phone: string;
  isWhatsapp: boolean;
  cep?: string;
  address?: string;
  number?: string;
  complement?: string;
  theme?: string;
  cpf?: string;
  cnpj?: string;
  dateOfBirth?: Date;
  name: string;
  role: string;
  type_person?: string; // Ajuste conforme a enumeração real, se aplicável
  situacao: boolean;
  created_at: Date;
  deleted_at?: Date;
  updated_at: Date;
};

class UsuarioService {
  async get(tipo_sistema?: string, tipo_pessoa?: TypePerson) {
    // Converta o nome do tipo de sistema para o ID correspondente
    let tipoSistemaId: number | undefined;
    if (tipo_sistema) {
      const tipoSistema = await prisma.tipo_sistema.findUnique({
        where: { nome: tipo_sistema } // Supondo que o nome do sistema seja um campo único
      });
      tipoSistemaId = tipoSistema?.id;
    }

    // Construir o objeto de filtros dinamicamente
    const filters: Prisma.usuarioWhereInput = {
      situacao: true, // sempre filtrar usuários com situacao = true
      ...(tipoSistemaId ? { tipo_sistemas: { some: { tipo_sistema: { id: tipoSistemaId } } } } : {}),
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

  async create(data: UsuarioInput) {
    // Valida o e-mail
    const DataUser = await EmailValidation(data.email);

    if (DataUser.emailValid) {
      throw new GraphQLError("Email já cadastrado no sistema!");
    }

    const uuid = v4(); // Gera o UUID para o novo usuário

    // Criptografa a senha
    const hashedPassword = await HashPassword(data.senha, 10);

    // Obtém os IDs dos tipos de sistema pelos nomes
    const tiposSistemas = await prisma.tipo_sistema.findMany({
      where: {
        nome: {
          in: data.tipo_sistemas_nomes || [],
        },
      },
    });

    if (tiposSistemas.length !== (data.tipo_sistemas_nomes?.length || 0)) {
      throw new GraphQLError("Alguns tipos de sistema fornecidos são inválidos.");
    }

    const tipoSistemaIds = tiposSistemas.map(ts => ts.id);

    // Cria o usuário e associa os tipos de sistema
    const user = await prisma.usuario.create({
      data: {
        senha: hashedPassword,
        email: data.email,
        telefone: data.telefone,
        is_whatsapp: data.isWhatsapp,
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento,
        cpf: data.cpf,
        cnpj: data.cnpj,
        data_nascimento: data.data_nascimento,
        nome: data.nome,
        funcao: data.funcao,
        tipo_pessoa: data.tipo_pessoa || 'USER',  // Valor padrão se tipo_pessoa não for fornecido
        uuid,
        usuario_foto: data.usuario_foto || '',  // Valor padrão se usuario_foto não for fornecido
        situacao: true,
        created_at: new Date(),
        tipo_sistemas: {
          create: tipoSistemaIds.map(id => ({
            tipo_sistema: {
              connect: { id },
            },
          })),
        },
      },
    });

    return user;
  }


  async update(id: number, data: object) {
    const user = await prisma.usuario.update({
      where: { id },
      data,
    });

    return user;
  }

  async delete(id: number) {
    const user = await prisma.usuario.update({
      where: { id },
      data: { situacao: false },
    });
    return user;
  }
}


export default new UsuarioService();
