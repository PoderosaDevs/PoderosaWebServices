// src/models/Categoria.ts
import { ObjectType, Field, ID } from 'type-graphql';
import { ProdutoModel } from './Produto';
import { PaginationInfo } from './Utils';

@ObjectType()
export class CategoriaModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => [ProdutoModel])
  produtos?: ProdutoModel[];
}

@ObjectType()
export class CategoriaResult {
  @Field(() => [CategoriaModel])
  result!: CategoriaModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
