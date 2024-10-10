// src/models/Categoria.ts
import { ObjectType, Field, ID } from 'type-graphql';
import { ProdutoModel } from './Produto';

@ObjectType()
export class CategoriaModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => [ProdutoModel])
  produtos?: ProdutoModel[];
}
