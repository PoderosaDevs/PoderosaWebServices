import { ObjectType, Field, ID } from 'type-graphql';
import { ProdutoModel } from './Produto'; // Ajuste o caminho conforme necessário

@ObjectType()
export class TipoSistemaProdutoModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => [ProdutoModel], { nullable: true })
  produtos?: ProdutoModel[]; // Campo para representar a associação inversa
}
