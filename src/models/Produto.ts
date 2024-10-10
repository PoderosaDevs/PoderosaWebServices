import { ObjectType, Field, ID, Float, Int } from 'type-graphql';
import { CategoriaModel } from './Categoria'; // Ajuste o caminho conforme necessário
import { MarcaModel } from './Marca'; // Ajuste o caminho conforme necessário
import { TipoSistemaModel } from './TipoSistema'; // Ajuste o caminho conforme necessário
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

  @Field(() => [CategoriaModel], { nullable: true })
  categorias?: CategoriaModel[];

  @Field(() => MarcaModel, { nullable: true })
  marca?: MarcaModel;

  @Field(() => TipoSistemaModel, { nullable: true })
  tipo_sistema?: TipoSistemaModel;
}

@ObjectType()
export class ProdutoResult {
  @Field(() => [ProdutoModel])
  result!: ProdutoModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
