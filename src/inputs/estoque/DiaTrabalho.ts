import { InputType, Field } from 'type-graphql';

@InputType()
export class DiaTrabalhadoEstoqueInput {
  @Field()
  pedidos!: number;

  @Field()
  realizados!: number;

  @Field()
  horario_entrada!: string; // Assegura que este campo não pode ser undefined

  @Field()
  horario_saida!: string; // Assegura que este campo não pode ser undefined

  @Field() // O campo agora é obrigatório
  usuarioId!: number; // Nunca deve ser opcional

  @Field()
  data_trabalho!: Date; // Assegura que este campo não pode ser undefined
}


@InputType()
export class DiaTrabalhadoEstoqueInputUpdate {
  @Field()
  id!: number;

  @Field()
  pedidos!: number;

  @Field()
  realizados!: number;

  @Field()
  horario_entrada!: string; // Assegura que este campo não pode ser undefined

  @Field()
  horario_saida!: string; // Assegura que este campo não pode ser undefined

  @Field()
  data_trabalho!: Date; // Assegura que este campo não pode ser undefined
}