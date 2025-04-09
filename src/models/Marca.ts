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
