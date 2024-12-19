import { Field, ID, ObjectType } from 'type-graphql';
import { PaginationInfo } from '../Utils';

@ObjectType()   
export class ObservacaoModel {
  @Field(() => ID)
  id!: number;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => Date, { nullable: true })
  data!: Date | null;
  

  @Field() // O campo agora é obrigatório
  usuario_id!: number; // Nunca deve ser opcional
}

@ObjectType()
export class ObservacaoResult {
  @Field(() => [ObservacaoModel])
  result!: ObservacaoModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
