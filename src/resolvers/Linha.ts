import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import LinhaServices from "../services/Linha"; // Ajuste o caminho conforme necessário
import { LinhaModel, LinhaResult } from "../models/Linha";
import { LinhaCreateInput, LinhaUpdateInput } from "../inputs/Linha";
import { Pagination } from "../inputs/Utils";

@Resolver(() => LinhaModel)
export class LinhaResolver {
  @Query(() => [LinhaResult])
  async GetLinhas(
    @Arg("pagination", () => Pagination, { nullable: true })
    pagination?: Pagination
  ): Promise<LinhaResult> {
    const linhas = await LinhaServices.get(pagination);
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
