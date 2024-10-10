import { InputType, Field, Int } from 'type-graphql';

// Input para criar uma loja
@InputType()
export class LojaCreateInput {
  @Field(() => String)
  nome_fantasia!: string;

  @Field(() => String)
  razao_social!: string;
}

// Input para atualizar uma loja
@InputType()
export class LojaUpdateInput {
  @Field(() => Int)
  id!: number; 

  @Field(() => String)
  nome_fantasia!: string;

  @Field(() => String)
  razao_social!: string;
}
