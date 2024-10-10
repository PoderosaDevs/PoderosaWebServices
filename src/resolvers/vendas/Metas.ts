import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { MetaModel } from "../../models/vendas/Metas";
import MetaService from "../../services/vendas/Metas";
import { CreateMetaInput, UpdateMetaInput } from "../../inputs/vendas/Metas";

@Resolver()
export class MetaResolver {
  @Query(() => [MetaModel])
  async GetMetas() {
    return await MetaService.get();
  }

  @Query(() => MetaModel, { nullable: true })
  async GetMetaByID(@Arg("id") id: number) {
    return await MetaService.getById(id);
  }

  @Mutation(() => MetaModel)
  async SetMeta(@Arg("data") data: CreateMetaInput) {
    return await MetaService.create(data);
  }

  @Mutation(() => MetaModel, { nullable: true })
  async PutMeta(@Arg("id") id: number, @Arg("data") data: UpdateMetaInput) {
    return await MetaService.update(data);
  }

  @Mutation(() => Boolean) // Retorna um booleano para indicar sucesso/falha
  async DeleteMeta(@Arg("id") id: number) {
    return await MetaService.delete(id);
  }
}
