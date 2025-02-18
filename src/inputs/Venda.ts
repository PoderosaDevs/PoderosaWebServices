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

@InputType()
export class VendaInput {
  @Field(() => Int)
  funcionarioId!: number;

  @Field(() => Int)
  lojaId!: number;

  @Field(() => [VendaDetalheInput])
  vendaDetalhes!: VendaDetalheInput[];

  @Field(() => Float, { nullable: true })
  pontos_totais?: number;

  @Field(() => Date, { nullable: true })
  data_venda?: Date; // Ajustado para ser opcional
}