// src/models/Pedido.ts
import { ObjectType, Field, ID, Float, Int } from 'type-graphql';

@ObjectType()
export class PedidoModel {
  @Field(() => ID)
  id!: number;

  @Field(() => Int)
  numero!: number;

  @Field()
  data!: Date;

  @Field()
  dataPrevista!: Date;

  @Field(() => Float)
  totalProdutos!: number;

  @Field(() => Float)
  total!: number;

  @Field()
  ordemCompra!: string;

  @Field()
  observacoes!: string;

  @Field()
  observacoesInternas!: string;
}
