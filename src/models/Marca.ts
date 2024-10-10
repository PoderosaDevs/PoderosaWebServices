import { ObjectType, Field, ID } from 'type-graphql';
import { ProdutoModel } from './Produto';

@ObjectType()
export class MarcaModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => [ProdutoModel], { nullable: true })
  produtos?: ProdutoModel[];
}
