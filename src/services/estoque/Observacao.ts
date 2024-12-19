import { GraphQLError } from "graphql";
import { prisma } from "../../database";
import { ObservacaoInput, ObservacaoUpdateInput } from "../../inputs/estoque/Observacao";
import { Pagination } from "../../inputs/Utils";
import { ObservacaoResult } from "../../models/estoque/Observacao";
import getPageInfo from "../../helpers/getPageInfo";

class Observacao {
  /**
   * Busca observações de um usuário específico.
   * @param userId - ID do usuário.
   * @returns Lista de observações associadas ao usuário.
   */
  async get(
    userId: number,
    pagination?: Pagination
  ): Promise<ObservacaoResult> {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = pagination.pagina ?? 0;
      quantidade = pagination.quantidade ?? 10;
    }

    const dataTotal = await prisma.observacao.count({
      where: {
        usuario_id: userId,
      },
    });
    console.log(dataTotal)
    const DataPageInfo = getPageInfo(dataTotal, pagina, quantidade);

    const observacoes = await prisma.observacao.findMany({
      where: {
        usuario_id: userId,
      },
    });

    return { result: observacoes, pageInfo: DataPageInfo };
  }

  /**
  * Busca uma observação especifica de um usuário específico.
  * @param id - ID do usuário.
  * @returns Lista de observações associadas ao usuário.
  */
  async getByID(id: number) {
    const observacao = await prisma.observacao.findUnique({
      where: {
        id: id,
      },
    });

    return observacao;
  }

  /**
   * Cria uma nova observação associada a um usuário.
   * @param data - Dados para criar a observação.
   * @returns A observação criada.
   */
  async create(data: ObservacaoInput) {
    const { title, data: dataObs, description, usuario_id } = data;

    // Verifica se o usuário existe
    const usuarioExists = await prisma.usuario.findUnique({
      where: { id: usuario_id },
    });

    if (!usuarioExists) {
      throw new GraphQLError("Usuário não encontrado.");
    }

    // Cria a nova observação
    const observacao = await prisma.observacao.create({
      data: {
        title,
        data: dataObs,
        description,
        usuario: {
          connect: { id: usuario_id },
        },
      },
    });

    return observacao;
  }

  /**
   * Remove uma observação pelo ID.
   * @param observacaoId - ID da observação.
   * @returns Mensagem de sucesso ou erro.
   */
  async delete(observacaoId: number) {
    const observacao = await prisma.observacao.findUnique({
      where: { id: observacaoId },
    });

    if (!observacao) {
      throw new GraphQLError("Observação não encontrada.");
    }

    await prisma.observacao.delete({
      where: { id: observacaoId },
    });

    return { message: "Observação deletada com sucesso." };
  }

  /**
   * Atualiza uma observação existente.
   * @param observacaoId - ID da observação a ser atualizada.
   * @param data - Dados para atualização.
   * @returns A observação atualizada.
   */
  async update(data: ObservacaoUpdateInput) {

    console.log("ID recebido:", data.id); // Deve ser um número
    console.log("Tipo do ID:", typeof data.id); // Deve retornar "number"

    const observacao = await prisma.observacao.findUnique({
      where: { id: data.id },
    });

    if (!observacao) {
      throw new GraphQLError("Observação não encontrada.");
    }

    const updatedObservacao = await prisma.observacao.update({
      where: { id: observacao.id },
      data: {
        title: data.title,
        data: data.data,
        description: data.description,
      },
    });

    return updatedObservacao;
  }
}

export default new Observacao();
