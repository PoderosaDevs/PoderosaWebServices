import { ObjectType, Field, ID, Int, Float } from "type-graphql";
import { TypePerson } from "../enums/TypePerson";
import { PaginationInfo } from "./Utils";

@ObjectType()
export class UsuarioModel {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  token_api?: string;

  @Field()
  senha!: string;

  @Field()
  email!: string;

  @Field()
  telefone!: string;

  @Field()
  uuid!: string;

  @Field()
  isWhatsapp!: boolean;

  @Field({ nullable: true })
  cep?: string;

  @Field({ nullable: true })
  endereco?: string;

  @Field({ nullable: true })
  numero?: string;

  @Field({ nullable: true })
  complemento?: string;

  @Field({ nullable: true })
  tema?: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  cnpj?: string;

  @Field(() => Date, { nullable: true })
  data_nascimento?: Date;

  @Field()
  nome!: string;

  @Field()
  funcao!: string;

  @Field(() => TypePerson, { nullable: true })
  tipo_pessoa?: TypePerson;

  @Field({ nullable: true })
  usuario_foto?: string;

  @Field()
  situacao!: boolean;

  @Field()
  created_at!: Date;

  @Field({ nullable: true })
  deleted_at?: Date;

  @Field()
  updated_at!: Date;
}

@ObjectType()
export class UsuarioResult {
  @Field(() => [UsuarioModel])
  result!: UsuarioModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}

@ObjectType()
export class UsuarioPontosModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field()
  email!: string;

  @Field(() => TypePerson, { nullable: true })
  tipo_pessoa?: TypePerson;

  @Field(() => Int)
  pontos_totais!: number; // Soma dos pontos das vendas do usuário
}

@ObjectType()
export class UsuarioPontosResult {
  @Field(() => [UsuarioPontosModel])
  result!: UsuarioPontosModel[];

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}

@ObjectType()
export class MarcaVendaModel {
  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade!: number;

  @Field(() => Int)
  pontos_tratamento!: number;

  @Field(() => Int)
  pontos_coloracao!: number;
}

@ObjectType()
class LojaVendaModel {
  @Field()
  nome!: string;

  @Field(() => Int)
  quantidade!: number;

    @Field(() => Int)
  pontos_tratamento!: number;

  @Field(() => Int)
  pontos_coloracao!: number;
}

@ObjectType()
export class UsuarioInsights {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field()
  email!: string;

  @Field(() => TypePerson, { nullable: true })
  tipo_pessoa?: TypePerson;

  @Field(() => Int)
  pontos_totais!: number;

  @Field(() => Int)
  pontos_totais_coloracao!: number;

  @Field(() => Int)
  pontos_totais_tratamento!: number;

  @Field(() => [MarcaVendaModel])
  marcas!: MarcaVendaModel[];

  @Field(() => [LojaVendaModel])
  lojas!: LojaVendaModel[];
}

@ObjectType()
export class UsuarioInsightsResult {
  @Field(() => UsuarioInsights)
  result!: UsuarioInsights;

  @Field(() => PaginationInfo)
  pageInfo!: PaginationInfo;
}

@ObjectType()
export class CategoriaResumo {
  @Field()
  title!: string;

  @Field(() => Float)
  value!: number;
}

@ObjectType()
export class GastosPeriodosResponse {
  @Field()
  data!: string; // data formatada (dd/MM/yyyy ou MM/yyyy)

  @Field(() => [CategoriaResumo])
  categories!: CategoriaResumo[];
}