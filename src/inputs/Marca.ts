import { InputType, Field, Int } from 'type-graphql';

// Input para criar uma nova Marca
@InputType()
export class MarcaCreateInput {
  @Field()
  nome!: string;

  @Field()
  cor!: string;
}

// Input para atualizar uma Marca
@InputType()
export class MarcaUpdateInput {
  @Field({ nullable: true })
  nome?: string;

  @Field()
  cor?: string;
}

// Input para associar Produtos a uma Linha
@InputType()
export class AssociacaoProdutosInput {
  @Field(() => Int)
  linhaId!: number;

  @Field(() => [Int])
  produtoIds!: number[];
}

// Input para associar uma Marca a uma Linha
@InputType()
export class AssociacaoMarcaInput {
  @Field(() => Int)
  linhaId!: number;

  @Field(() => Int)
  marcaId!: number;
}


@InputType()
export class BrandsInsightsFilterInput {
  @Field(() => String, { nullable: true })
  startDate?: string; // dd/MM/yyyy

  @Field(() => String, { nullable: true })
  endDate?: string; // dd/MM/yyyy

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  pagina?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  quantidade?: number;
}
