import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import LojaServices from "../../services/vendas/Loja"; // Ajuste o caminho conforme necessário
import { LojaModel } from "../../models/vendas/Loja";
import { LojaCreateInput, LojaUpdateInput } from "../../inputs/vendas/Loja";

@Resolver(() => LojaModel)
export class LojaResolver {
  @Query(() => [LojaModel])
  async GetLojas() {
    const lojas = await LojaServices.get();
    return lojas;
  }

  @Query(() => LojaModel, { nullable: true })
  async GetLojaByID(@Arg("id", () => Int) id: number) {
    const loja = await LojaServices.getById(id);
    return loja;
  }

  @Mutation(() => LojaModel)
  async SetLoja(@Arg("data") data: LojaCreateInput) {
    const loja = await LojaServices.create(data);
    return loja;
  }

  @Mutation(() => LojaModel)
  async PutLoja(@Arg("data") data: LojaUpdateInput) {
    const loja = await LojaServices.update(data);
    return loja;
  }

  @Mutation(() => LojaModel)
  async DeleteLoja(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      await LojaServices.delete(id);
      return true; // Indica sucesso
    } catch (error) {
      console.error("Erro ao deletar loja:", error); // Loga o erro para depuração
      return false; // Indica falha
    }
  }
}
