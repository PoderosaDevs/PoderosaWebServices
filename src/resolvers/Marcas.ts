// marcaResolver.ts

import { Resolver, Mutation, Query, Arg, Int } from 'type-graphql';
import MarcaService from '../services/Marca';
import { BrandInsightsResponse, MarcaModel } from '../models/Marca';
import { BrandsInsightsFilterInput } from '../inputs/Marca';

@Resolver()
export class MarcaResolver {
  @Query(() => [MarcaModel])
  async GetMarcas() {
    return MarcaService.get();
  }

  @Query(() => BrandInsightsResponse)
  async getBrandsInsights(
    @Arg("filters", { nullable: true }) filters?: BrandsInsightsFilterInput
  ): Promise<BrandInsightsResponse> {
    return await MarcaService.getBrandsInsights(
      filters?.startDate,
      filters?.endDate,
      filters?.pagina ?? 0,
      filters?.quantidade ?? 10
    );
  }

  @Query(() => MarcaModel)
  async GetMarcaByID(@Arg("id", () => Int) id: number) {
    return MarcaService.getById(id);
  }

  @Mutation(() => MarcaModel)
  async SetMarca(
    @Arg("nome") nome: string,
    @Arg("cor") cor: string
  ) {
    return MarcaService.create(nome, cor);
  }

  @Mutation(() => MarcaModel)
  async SetProdutoMarca(
    @Arg("marcaID", () => Int) marcaID: number,
    @Arg("produtoIds", () => [Int]) produtoIds: number[]
  ) {
    try {
      // Chama a função para associar produtos à marca
      const marcaAtualizada = await MarcaService.associationProdutos(marcaID, produtoIds);
  
      // Retorna a marca atualizada após a associação
      return marcaAtualizada;
    } catch (error) {
      console.error(error);
      return null;  // Retorna null ou você pode lançar um erro personalizado
    }
  }

  @Mutation(() => MarcaModel, { nullable: true })
  async PutMarca(
    @Arg("id", () => Int) id: number,
    @Arg("nome") nome: string,
    @Arg("cor") cor: string

  ) {
    try {
      return await MarcaService.update(id, nome, cor);
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
