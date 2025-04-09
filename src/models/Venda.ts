import { ObjectType, Field, Int, Float } from 'type-graphql';
import { LojaModel } from './Loja';
import { ProdutoModel } from './Produto';
import { UsuarioModel } from './Usuario';

@ObjectType()
export class VendaDetalhe {
  @Field(() => Int)
  id!: number;

  @Field(() => Int) // Corrigido para String
  produto_id!: number;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Int)
  pontos!: number;

  @Field(() => ProdutoModel)
  produto!: ProdutoModel;
}

@ObjectType()
export class VendaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => Date)
  data_venda!: Date;

  @Field(() => Float)
  pontos_totais!: number;

  @Field(() => Boolean)
  situacao!: boolean;

  @Field(() => UsuarioModel)
  funcionario!: UsuarioModel;

  @Field(() => LojaModel)
  loja!: LojaModel;

  @Field(() => [VendaDetalhe], { nullable: 'items' }) // Permite que a lista de detalhes seja vazia, mas não null
  venda_detalhe!: VendaDetalhe[];
}





@ObjectType()
export class StoreInsights {
  @Field(() => Int)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => Int)
  total_vendas!: number;
}

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;

  @Field(() => Int)
  totalItems!: number;

  @Field()
  hasNextPage!: boolean;

  @Field()
  hasPreviousPage!: boolean;
}

@ObjectType()
export class StoreInsightsResponse {
  @Field(() => [StoreInsights])
  result!: StoreInsights[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;
}