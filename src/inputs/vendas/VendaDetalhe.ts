import { InputType, Field, Int, Float } from 'type-graphql';

@InputType()
export class VendaDetalheInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  produtoId!: number;

  @Field(() => Int)
  quantidade!: number;
}
