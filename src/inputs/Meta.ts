import {
  InputType,
  Field,
  Int,
  GraphQLISODateTime,
} from "type-graphql";

@InputType()
export class MetaEtapaInput {
  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade_objetivo!: number;
}

@InputType()
export class CreateMetaInput {
  @Field()
  nome!: string;

  @Field(() => Int)
  marcaId!: number;

  @Field(() => Int)
  quantidade_objetivo!: number;

  @Field(() => GraphQLISODateTime)
  data_inicio!: Date;

  @Field(() => GraphQLISODateTime)
  data_fim!: Date;

  @Field(() => Int)
  usuarioId!: number;         

  @Field({ nullable: true })
  descricao?: string;

  @Field(() => [MetaEtapaInput], { nullable: true })
  etapas!: MetaEtapaInput[];
}
