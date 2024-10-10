import { ObjectType, Field, Int } from "type-graphql";
import { MarcaModel } from "./Marca";
import { ProdutoModel } from "./Produto";
import { TipoSistemaModel } from "./TipoSistema";
import { PaginationInfo } from "./Utils";

@ObjectType()
export class ProdutoSimpleModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;
}

@ObjectType()
export class LinhaModel {
  @Field(() => Int)
  id!: number;

  @Field(() => String)
  nome!: string;

  @Field(() => [TipoSistemaModel])
  tipo_sistemas!: TipoSistemaModel[];

  @Field(() => [ProdutoSimpleModel])
  produtos!: ProdutoSimpleModel[];

  @Field(() => MarcaModel, { nullable: true })
  marca?: MarcaModel;
}


@ObjectType()
export class LinhaResult {
  @Field(() => [LinhaModel])
  result!: LinhaModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}
