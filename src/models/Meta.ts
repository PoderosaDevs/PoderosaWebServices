// models/Meta.ts
import { ObjectType, Field, Int, Float, ID } from 'type-graphql';

@ObjectType()
export class MetaModel {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field({ nullable: true })
  descricao?: string;

  @Field(() => Int)
  usuario_id!: number;

  @Field(() => Date)
  data_inicio!: Date;

  @Field({ nullable: true })
  data_fim?: Date;

  @Field(() => Float)
  pontos_objetivo!: number;

  @Field(() => [MetaEtapaModel])
  meta_etapas!: MetaEtapaModel[];

  @Field(() => Int, { nullable: true })
  marcaId!: number;
}


@ObjectType()
export class MetaEtapaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Int)
  meta_id!: number;

  @Field(() => Int)
  etapa_numero!: number;

  @Field(() => Float)
  quantidade!: number;

  @Field()
  recompensa!: string;

  @Field(() => Float)
  valor!: number;

  @Field()
  atingida!: boolean;

  @Field(() => Int)
  importancia!: number;

  @Field(() => MetaModel)
  meta!: MetaModel;
}