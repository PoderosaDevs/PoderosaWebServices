import { GraphQLError } from "graphql";
import { prisma } from "../../database";
import { DuplaEstoqueInput } from "../../inputs/estoque/DuplaEstoque";

class DuplaEstoque {

  async getAllDuplas() {
    const duplas = await prisma.dupla_estoque.findMany({
      include: {
        usuario1: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
        usuario2: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });

    return duplas;
  }


  async create(data: DuplaEstoqueInput) {
    // Verifica se os usuários existem
    const user1 = await prisma.usuario.findUnique({ where: { id: data.usuarioId1 } });
    const user2 = await prisma.usuario.findUnique({ where: { id: data.usuarioId2 } });
  
    if (!user1 || !user2) {
      throw new GraphQLError("Um ou ambos os usuários não foram encontrados.");
    }
  
    // Verifica se já existe uma dupla com esses usuários
    const existingDupla = await prisma.dupla_estoque.findFirst({
      where: {
        OR: [
          { usuarioId1: data.usuarioId1, usuarioId2: data.usuarioId2 },
          { usuarioId1: data.usuarioId2, usuarioId2: data.usuarioId1 },
        ],
      },
    });
  
    if (existingDupla) {
      throw new GraphQLError("Essa dupla já existe.");
    }
  
    // Cria a nova dupla
    const dupla = await prisma.dupla_estoque.create({
      data: {
        usuarioId1: data.usuarioId1,
        usuarioId2: data.usuarioId2,
        data_associacao: new Date(),
      },
    });
  
    return dupla;
  }
  

  async deleteDupla(usuarioId: number) {
    // Busca a dupla onde o usuário corresponde a `usuarioId1` ou `usuarioId2`
    const dupla = await prisma.dupla_estoque.findFirst({
      where: {
        OR: [
          { usuarioId1: usuarioId },
          { usuarioId2: usuarioId },
        ],
      },
    });

    // Se a dupla não for encontrada, lança um erro
    if (!dupla) {
      throw new Error("Dupla não encontrada para o usuário especificado.");
    }

    // Exclui a dupla encontrada
    await prisma.dupla_estoque.delete({
      where: {
        id: dupla.id,
      },
    });

    return { message: "Dupla deletada com sucesso." };
  }



}

export default new DuplaEstoque();