import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { CategoriaModel } from './Categoria'; // Ajuste o caminho conforme necessário
import { MarcaModel } from './Marca'; // Ajuste o caminho conforme necessário
import { PaginationInfo } from "./Utils";

@ObjectType()
export class ProdutoModel {
  @Field(() => ID)
  id!: number;

  @Field()
  codigo!: string;

  @Field()
  nome!: string;

  @Field()
  descricao?: string;

  @Field(() => Int)
  estoque?: number;

  @Field({ nullable: true })
  id_fornecedor?: string; // Deve ser `string | undefined`, não `string | null`

  @Field(() => Int, { nullable: true })
  id_marca?: number;

  @Field(() => Float, { nullable: true })
  preco?: number;

  @Field(() => Int, { nullable: true })
  pontos?: number;

  @Field({ nullable: true })
  formato?: string;

  @Field(() => Date, { nullable: true })
  data_expiracao?: Date;

  @Field()
  situacao!: boolean;

  @Field({ nullable: true })
  imagem?: string;

  @Field(() => [CategoriaModel], { nullable: true })
  categorias?: CategoriaModel[];

  @Field(() => MarcaModel, { nullable: true })
  marca?: MarcaModel;

}

@ObjectType()
export class ProdutoResult {
  @Field(() => [ProdutoModel])
  result!: ProdutoModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
