import { Resolver, Query, Mutation, Arg } from "type-graphql";
import ObservacaoServices from '../../services/estoque/Observacao';
import { ObservacaoModel, ObservacaoResult } from "../../models/estoque/Observacao";
import { ObservacaoInput, ObservacaoUpdateInput } from "../../inputs/estoque/Observacao";
import { Pagination } from "../../inputs/Utils";

@Resolver()
export class ObservacaoResolver {

  // Query para obter todas as observações de um usuário
  @Query(() => ObservacaoResult)
  async GetObservacoes(
    @Arg("userId") userId: number,
    @Arg("pagination", () => Pagination, { nullable: true }) pagination?: Pagination
  ): Promise<ObservacaoResult> {
    return await ObservacaoServices.get(userId, pagination);
  }


  // Query para obter uma unica observação de um usuário
  @Query(() => ObservacaoModel)
  async GetObservacaoByID(@Arg("id") id: number) {
    return await ObservacaoServices.getByID(id);
  }

  // Mutation para criar uma nova observação
  @Mutation(() => ObservacaoModel)
  async SetObservacao(@Arg("data") data: ObservacaoInput) {
    if (!data.usuario_id) {
      throw new Error("O ID do usuário é obrigatório para criar uma observação.");
    }
    return await ObservacaoServices.create(data);
  }

  // Mutation para deletar uma observação com base no ID
  @Mutation(() => ObservacaoModel, { nullable: true })
  async DeleteObservacao(@Arg("observacaoId") observacaoId: number) {
    return await ObservacaoServices.delete(observacaoId);
  }

  // Mutation para atualizar uma observação existente
  @Mutation(() => ObservacaoModel)
  async PutObservacao(
    @Arg("data") data: ObservacaoUpdateInput
  ) {
    return await ObservacaoServices.update(data);
  }
}
