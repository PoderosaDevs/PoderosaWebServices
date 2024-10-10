// src/models/Avaliacao.ts
import { ObjectType, Field, ID, Int } from 'type-graphql';
import { ProdutoModel } from './Produto';
import { UsuarioModel } from './Usuario';

@ObjectType()
export class AvaliacaoModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  nota!: number;

  @Field()
  comentario?: string;

  @Field()
  id_produto!: string;

  @Field()
  id_usuario!: number;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => ProdutoModel)
  produto!: ProdutoModel;

  @Field(() => UsuarioModel)
  usuario!: UsuarioModel;
}
