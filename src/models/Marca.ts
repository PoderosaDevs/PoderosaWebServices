import { ObjectType, Field, ID } from 'type-graphql';
import { ProdutoModel } from './Produto';
import { PaginationInfo } from './Utils';

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

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
