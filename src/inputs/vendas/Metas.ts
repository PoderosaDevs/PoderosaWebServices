import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateMetaInput {
  @Field(() => Int)
  quantidade_total!: number;

  @Field(() => String)
  descricao!: string;

  @Field(() => Date)
  data_inicio!: Date;

  @Field(() => Date)
  data_fim!: Date;

  @Field(() => Int)
  marca_id!: number;

  @Field(() => [Int], { nullable: true })
  usuarios_id?: number[]; // IDs dos usuários associados

  @Field()
  situacao!: boolean;

  @Field(() => [Int], { nullable: true })
  etapas?: CreateEtapaInput[]; // Lista de etapas, se existir
}

@InputType()
export class UpdateMetaInput {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  descricao?: string;

  @Field(() => Int, { nullable: true })
  quantidade_total?: number;

  @Field(() => Date, { nullable: true })
  data_inicio?: Date;

  @Field(() => Date, { nullable: true })
  data_fim?: Date;

  @Field(() => Int, { nullable: true })
  marca_id?: number;

  @Field(() => [Int], { nullable: true })
  usuarios_id?: number[]; // IDs dos usuários associados

  @Field({ nullable: true })
  situacao?: boolean;

  @Field(() => [Int], { nullable: true })
  etapas?: UpdateEtapaInput[]; // Lista de etapas, se existir
}


@InputType()
export class CreateEtapaInput {
  @Field(() => Int)
  quantidade!: number; // Quantidade para a etapa
}

@InputType()
export class UpdateEtapaInput {
  @Field(() => Int)
  id!: number; // ID da etapa a ser atualizada

  @Field(() => Int, { nullable: true })
  quantidade?: number; // Novo valor para a quantidade
}