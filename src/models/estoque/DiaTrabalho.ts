import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class DiaTrabalhadoEstoqueModel {
  @Field(() => ID)
  id!: number;

  @Field()
  pedidos!: number;

  @Field()
  realizados!: number;

  @Field()
  horario_entrada!: string;

  @Field()
  horario_saida!: string;

  @Field()
  data_trabalho!: Date; // Data do trabalho, fornecida pelo usuário

  @Field(() => Int, { nullable: true })
  usuarioId?: number; // ID do usuário associado, opcional

}
