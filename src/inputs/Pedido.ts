import { InputType, Field, Float, Int } from 'type-graphql';

@InputType()
export class PedidoInput {
  @Field(() => Int)
  numero!: number;

  @Field(() => Date)
  data!: Date;

  @Field(() => Date)
  data_prevista!: Date;

  @Field(() => Float)
  total_produtos!: number;

  @Field(() => Float)
  total!: number;

  @Field()
  ordem_compra!: string;

  @Field()
  observacoes!: string;

  @Field()
  observacoes_internas!: string;
}
