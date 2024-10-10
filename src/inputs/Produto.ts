import { InputType, Field, Float, Int } from 'type-graphql';
import { CategoriaInput } from './Categoria'; // Ajuste o caminho conforme necessário

@InputType()
export class ProdutoInput {
  @Field()
  codigo!: string;

  @Field()
  nome!: string;

  @Field()
  descricao!: string;

  @Field(() => Int)
  estoque!: number;

  @Field({ nullable: true })
  id_fornecedor?: string;

  @Field(() => Int, { nullable: true })
  id_marca?: number;

  @Field(() => Float, { nullable: true })
  preco?: number;

  @Field(() => Int, { nullable: true })
  pontos?: number;

  @Field({ nullable: true })
  formato?: string;

  @Field(() => Date, { nullable: true }) // Considerar conversão explícita de String para Date
  data_expiracao?: Date;

  @Field()
  is_frete_gratis!: boolean;

  @Field(() => Float, { nullable: true })
  peso_liquido?: number;

  @Field(() => Float, { nullable: true })
  peso_bruto?: number;

  @Field(() => Float, { nullable: true })
  largura?: number;

  @Field(() => Float, { nullable: true })
  altura?: number;

  @Field(() => Float, { nullable: true })
  profundidade?: number;

  @Field(() => Int, { nullable: true })
  volumes?: number;

  @Field(() => Int, { nullable: true })
  itens_por_caixa?: number;

  @Field({ nullable: true })
  unidade_de_medida?: string;

  @Field()
  situacao!: boolean;

  @Field({ nullable: true })
  imagem?: string;

  @Field(() => [CategoriaInput], { nullable: true }) // Opcional, mas lista de objetos CategoriaInput
  categorias?: CategoriaInput[];

  @Field(() => String, { nullable: true }) // Sistema é identificado por uma string de nome
  tipo_sistemas_nomes?: string;
}
