import { ObjectType, Field, ID, Int } from "type-graphql";
import { ProdutoModel } from "./Produto";
import { PaginationInfo } from "./Utils"; // ✅ Já contém PageInfo

@ObjectType()
export class MarcaModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field()
  cor!: string;

  @Field(() => [ProdutoModel], { nullable: true })
  produtos?: ProdutoModel[];
}

@ObjectType()
export class MarcaResult {
  @Field(() => [MarcaModel])
  result!: MarcaModel[];

  @Field(() => PaginationInfo) // ✅ Substituindo PageInfo por PaginationInfo
  pageInfo!: PaginationInfo;
}

@ObjectType()
export class BrandInsights {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => Number)
  total_vendas!: number;
}

@ObjectType()
export class BrandInsightsResponse {
  @Field(() => [BrandInsights])
  result!: BrandInsights[];

  @Field(() => PaginationInfo) // 
  pageInfo!: PaginationInfo;
}



@ObjectType()
class LojasDaMarcaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome_fantasia!: string;

  @Field(() => Int)
  pontos_totais!: number;

  @Field(() => Int)
  pontos_totais_coloracao!: number;

  @Field(() => Int)
  pontos_totais_tratamento!: number;
}

@ObjectType()
class VendedoresDaMarcaModel {
  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Int)
  pontos_totais_coloracao!: number;

  @Field(() => Int)
  pontos_totais_tratamento!: number;
}

@ObjectType()
export class MarcaInsights {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => Int)
  pontos_totais!: number;

  @Field(() => Int)
  pontos_totais_coloracao!: number;

  @Field(() => Int)
  pontos_totais_tratamento!: number;

  @Field(() => [LojasDaMarcaModel])
  lojas!: LojasDaMarcaModel[];

  @Field(() => [VendedoresDaMarcaModel])
  vendedores!: VendedoresDaMarcaModel[];
}

@ObjectType()
export class MarcaInsightsResult {
  @Field(() => MarcaInsights)
  result!: MarcaInsights;

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}