import { Field, Int, ObjectType } from "type-graphql";
import { PaginationInfo } from "./Utils";

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
