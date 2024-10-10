import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import LinhaServices from "../services/Linha"; // Ajuste o caminho conforme necessário
import { LinhaModel } from "../models/Linha";
import { LinhaCreateInput, LinhaUpdateInput } from "../inputs/Linha";

@Resolver(() => LinhaModel)
export class LinhaResolver {
  @Query(() => [LinhaModel])
  async GetLinhas() {
    const linhas = await LinhaServices.get();
    return linhas;
  }

  @Query(() => LinhaModel, { nullable: true })
  async GetLinhaByID(@Arg("id", () => Int) id: number) {
    const linha = await LinhaServices.getById(id);
    return linha;
  }

  @Mutation(() => LinhaModel)
  async SetLinha(@Arg("data") data: LinhaCreateInput) {
    const linha = await LinhaServices.create(data);
    return linha;
  }

  @Mutation(() => LinhaModel)
  async PutLinha(@Arg("data") data: LinhaUpdateInput) {
    const linha = await LinhaServices.update(data);
    return linha;
  }

  @Mutation(() => Boolean)
  async DeleteLinha(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      await LinhaServices.delete(id);
      return true; // Indica sucesso
    } catch (error) {
      console.error("Erro ao deletar linha:", error); // Loga o erro para depuração
      return false; // Indica falha
    }
  }
}
