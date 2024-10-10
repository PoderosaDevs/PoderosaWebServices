// marcaResolver.ts

import { Resolver, Mutation, Query, Arg, Int } from 'type-graphql';
import MarcaService from '../services/Marca';
import { MarcaModel } from '../models/Marca';

@Resolver()
export class MarcaResolver {
  @Query(() => [MarcaModel])
  async GetMarcas() {
    return MarcaService.get();
  }

  @Query(() => MarcaModel)
  async GetMarcaByID(@Arg("id", () => Int) id: number) {
    return MarcaService.getById(id);
  }

  @Mutation(() => MarcaModel)
  async SetMarca(@Arg("nome") nome: string) {
    return MarcaService.create(nome);
  }

  @Mutation(() => MarcaModel)
  async SetProdutoMarca(
    @Arg("linhaId", () => Int) linhaId: number,
    @Arg("produtoIds", () => [Int]) produtoIds: number[]
  ) {
    try {
      await MarcaService.associationProdutos(linhaId, produtoIds);
      return true;
    } catch {
      return false;
    }
  }


  @Mutation(() => MarcaModel, { nullable: true })
  async PutMarca(
    @Arg("id", () => Int) id: number,
    @Arg("nome") nome: string
  ) {
    try {
      return await MarcaService.update(id, nome);
    } catch {
      return null;
    }
  }

  @Mutation(() => Boolean)
  async DeleteMarca(@Arg("id", () => Int) id: number) {
    try {
      await MarcaService.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
