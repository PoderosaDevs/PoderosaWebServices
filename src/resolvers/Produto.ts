// src/resolvers/ProdutoResolver.ts
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { ProdutoModel, ProdutoResult } from "../models/Produto";
import ProdutoService from "../services/Produto";
import { ProdutoInput } from "../inputs/Produto";
import { Pagination } from "../inputs/Utils";

@Resolver()
export class ProdutoResolver {
  @Query(() => ProdutoResult)
  async GetProdutos(
    @Arg("tipo_sistema", { nullable: true }) tipo_sistema?: string,
    @Arg("marca", { nullable: true }) marca?: string,
    @Arg("categorias", () => [String], { nullable: true })
    categorias?: string[],
    @Arg("pagination", () => Pagination, { nullable: true })
    pagination?: Pagination
  ): Promise<ProdutoResult> {
    const produtos = await ProdutoService.get(
      tipo_sistema,
      marca,
      categorias,
      pagination
    );
    return produtos; // Retorna o objeto ProdutoResult
  }

  @Query(() => ProdutoModel, { nullable: true })
  async GetProdutoByID(@Arg("id") id: number) {
    const produto = await ProdutoService.getByID(id);
    return produto;
  }

  @Mutation(() => ProdutoModel)
  async SetProduto(@Arg("data") data: ProdutoInput) {
    const produto = await ProdutoService.create(data);
    return produto;
  }

  @Mutation(() => ProdutoModel, { nullable: true })
  async PutProduto(@Arg("id") id: string, @Arg("data") data: ProdutoInput) {
    // const produto = await ProdutoService.update(id, data);
    // return produto;
  }

  @Mutation(() => [ProdutoModel])
  async DeleteProduto(@Arg("id") id: number) {
    const produto = await ProdutoService.delete(id);
    return produto;
  }
}
