import { InputType, Field, Int } from 'type-graphql';

// Input para criar uma linha
@InputType()
export class LinhaCreateInput {
  @Field(() => String)
  nome!: string;

  @Field(() => Int)
  marcaId!: number;

  @Field(() => String, { nullable: true }) // Sistema é identificado por uma string de nome
  tipo_sistemas_nomes?: string[];

  @Field(() => [Int])
  produtosIds?: number[]; // IDs dos produtos a serem associados
}

// Input para atualizar uma linha
@InputType()
export class LinhaUpdateInput {
  @Field(() => Int)
  id!: number; // ID da linha a ser atualizada

  @Field(() => String)
  nome!: string; // Novo nome da linha
}
