import { InputType, Field, Int, Float } from 'type-graphql';
import { VendaDetalheInput } from './VendaDetalhe'; // Importa o input de detalhes da venda

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
