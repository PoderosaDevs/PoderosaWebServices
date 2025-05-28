import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import LojaService from "../services/Loja";
import { LojaInsightsResult, LojaModel, LojaResult } from "../models/Loja";
import { CreateLojaInput, LojaInsightsFiltroInput, UpdateLojaInput } from "../inputs/Lojas";
import { Pagination } from "../inputs/Utils";

@Resolver(() => LojaResult)
export class LojaResolver {
  @Query(() => LojaResult)
  async GetLojas(
    @Arg("pagination", () => Pagination, { nullable: true })
    pagination?: Pagination
  ): Promise<LojaResult> {
    const lojas = await LojaService.get(pagination);
    return lojas;
  }

  @Query(() => LojaModel, { nullable: true })
  async GetLojaByID(@Arg("id", () => Int) id: number) {
    const loja = await LojaService.getById(id);
    return loja;
  }


 @Query(() => LojaInsightsResult)
  async GetLojaInsights(
    @Arg("filters", { nullable: true }) filters?: LojaInsightsFiltroInput
  ) {
    return await LojaService.getStoreSalesById(
      filters!.lojaId!,
      filters?.startDate,
      filters?.endDate,
      filters?.pagina ?? 0,
      filters?.quantidade ?? 10
    );
  }

  @Mutation(() => LojaModel)
  async SetLoja(@Arg("data") data: CreateLojaInput) {
    const loja = await LojaService.create(data);
    return loja;
  }

  @Mutation(() => LojaModel)
  async PutLoja(@Arg("data") data: UpdateLojaInput) {
    const loja = await LojaService.update(data);
    return loja;
  }

  @Mutation(() => Boolean)
  async DeleteLoja(@Arg("id", () => Int) id: number): Promise<boolean> {
    try {
      await LojaService.delete(id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar loja:", error);
      return false;
    }
  }
}
