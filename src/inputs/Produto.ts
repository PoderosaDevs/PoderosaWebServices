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


  @Field(() => Int, { nullable: true })
  id_marca?: number;

  @Field(() => Float, { nullable: true })
  preco?: number;

  @Field(() => Int, { nullable: true })
  pontos?: number;

  @Field()
  situacao!: boolean;

  @Field({ nullable: true })
  imagem?: string;

  @Field(() => [CategoriaInput], { nullable: true }) // Opcional, mas lista de objetos CategoriaInput
  categorias?: CategoriaInput[];
}
