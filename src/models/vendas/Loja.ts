import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class LojaModel {
  @Field(() => Int)
  id!: number;

  @Field()
  nome_fantasia!: string;

  @Field()
  razao_social!: string;

  // Adicione outros campos conforme necessário, como relacionamentos
  // @Field(() => [VendaModel], { nullable: true })
  // vendas?: VendaModel[];
}
