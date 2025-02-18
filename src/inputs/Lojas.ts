import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateLojaInput {
  @Field()
  nome_fantasia!: string;

  @Field()
  razao_social!: string;
}

@InputType()
export class UpdateLojaInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  nome_fantasia?: string;

  @Field({ nullable: true })
  razao_social?: string;
}
