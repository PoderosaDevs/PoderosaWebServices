// models/Meta.ts
import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';

/* ---------- Enum da situação (mesma ordem do Prisma) ---------- */
export enum MetaSituacao {
  PENDENTE  = 'PENDENTE',
  ANDAMENTO = 'ANDAMENTO',
  CONCLUIDA = 'CONCLUIDA',
}

registerEnumType(MetaSituacao, {
  name: 'MetaSituacao',
});

/* ---------- Etapas ---------- */
@ObjectType()
export class MetaEtapaModel {
  @Field(() => Int)
  id!: number;

  // Prisma → meta_id  |  TypeScript → metaId
  @Field(() => Int, { name: 'meta_id' })
  metaId!: number;

  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade_objetivo!: number;

  @Field(() => Int)
  quantidade_atual!: number;

  @Field()
  atingida!: boolean;
}

/* ---------- Meta principal ---------- */
@ObjectType()
export class MetaModel {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field({ nullable: true })
  descricao?: string;

  @Field(() => Int)
  quantidade_objetivo!: number;

  @Field(() => Int)
  quantidade_atual!: number;

  @Field()
  data_inicio!: Date;

  @Field()
  data_fim!: Date;

  @Field(() => MetaSituacao)
  situacao!: MetaSituacao;

  /* ---- Relações (FKs) ---- */
  @Field(() => Int)
  usuarioId!: number;

  @Field(() => Int)
  marcaId!: number;

  /* ---- Relação 1:N com etapas ---- */
  @Field(() => [MetaEtapaModel])
  meta_etapas!: MetaEtapaModel[];
}
