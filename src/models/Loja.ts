import { Field, ID, Int, ObjectType } from "type-graphql";
import { PaginationInfo } from "./Utils";
import { MarcaVendaModel } from "./Usuario";

@ObjectType()
export class LojaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome_fantasia!: string;

  @Field(() => String)
  razao_social!: string;
}

@ObjectType()
export class LojaResult {
  @Field(() => [LojaModel])
  result!: LojaModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}




@ObjectType()
class VendedoresModel {
  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade!: number;
}

@ObjectType()
export class LojaInsights {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome_fantasia!: string;

  @Field(() => String)
  razao_social!: string;

  @Field(() => Int)
  pontos_totais!: number;

  @Field(() => [MarcaVendaModel])
  marca!: MarcaVendaModel[];

  @Field(() => [VendedoresModel])
  vendedores!: VendedoresModel[];
}

@ObjectType()
export class LojaInsightsResult {
  @Field(() => LojaInsights)
  result!: LojaInsights;

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}