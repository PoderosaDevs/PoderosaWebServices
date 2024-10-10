import { Field, InputType, ID } from "type-graphql";


@InputType()
export class AutenticacaoInput {
  @Field()
  email!: string;

  @Field()
  senha!: string;
}
