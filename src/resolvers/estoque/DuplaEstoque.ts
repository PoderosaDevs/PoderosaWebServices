import { Resolver, Query, Mutation, Arg } from "type-graphql";
import DuplaEstoqueServices from '../../services/estoque/DuplaEstoque';
import { DuplaEstoqueModel } from "../../models/estoque/DuplaEstoque";
import { DuplaEstoqueInput } from "../../inputs/estoque/DuplaEstoque";


@Resolver()
export class DuplaEstoqueResolver {
  
  // Query para obter todas as duplas
  @Query(() => [DuplaEstoqueModel])
  async GetDuplasEstoque() {
    return await DuplaEstoqueServices.getAllDuplas();
  }

  // Mutation para criar uma nova dupla
  @Mutation(() => DuplaEstoqueModel)
  async SetDuplaEstoque(@Arg("data") data: DuplaEstoqueInput) {
    if (!data.usuarioId1 || !data.usuarioId2) {
      throw new Error("Os IDs dos dois usuários são obrigatórios para criar uma dupla.");
    }
    return await DuplaEstoqueServices.create(data);
  }

  // Mutation para deletar uma dupla com base no ID de um único usuário
  @Mutation(() => DuplaEstoqueModel, { nullable: true })
  async DeleteDuplaEstoque(@Arg("usuarioId") usuarioId: number) {
    return await DuplaEstoqueServices.deleteDupla(usuarioId);
  }
}
