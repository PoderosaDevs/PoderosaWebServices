import { InputType, Field } from 'type-graphql';

@InputType()
export class ObservacaoInput {

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  data!: Date; // Assegura que este campo não pode ser undefined

  @Field() // O campo agora é obrigatório
  usuario_id!: number; // Nunca deve ser opcional

}


@InputType()
export class ObservacaoUpdateInput {
  @Field()
  id!: number;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field()
  data!: Date; // Assegura que este campo não pode ser undefined

  @Field() // O campo agora é obrigatório
  usuario_id!: number; // Nunca deve ser opcional

}
