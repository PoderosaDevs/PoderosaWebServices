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



@InputType()
export class LojaInsightsFiltroInput {
  @Field(() => String, { nullable: true })
  startDate?: string; // dd/MM/yyyy

  @Field(() => String, { nullable: true })
  endDate?: string; // dd/MM/yyyy

  @Field(() => Number, { nullable: false })
  lojaId!: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  pagina?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  quantidade?: number;
}
