import { ObjectType, Field, ID, Int } from 'type-graphql';
import { TypePerson } from '../enums/TypePerson';
import { PaginationInfo } from './Utils';

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
