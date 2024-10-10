import { Field, ID, ObjectType } from "type-graphql";
import { TypePerson } from "../enums/TypePerson";
import { TypeSystem } from "../enums/TypeSystem";

@ObjectType()
export class AutenticacaoModel {
  
  @Field(() => ID)
  id!: number;

  @Field()
  email!: string;

  @Field()
  nome!: string;

  @Field()
  uuid!: string;

  @Field()
  token_api?: string;

  @Field()
  telefone!: string;

  @Field()
  cpf?: string;

  @Field(() => TypePerson, { nullable: true })
  tipo_pessoa?: TypePerson;

  @Field(() => [TypeSystem], { nullable: true })
  tipos_sistemas?: TypeSystem[]; // Adiciona a lista de tipos de sistemas
}
