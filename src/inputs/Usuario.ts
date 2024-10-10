import { InputType, Field } from 'type-graphql';
import { TypePerson } from '../enums/TypePerson'; // Ajuste o caminho conforme necessário
import { DateScalar } from '../scalars/DateScalar'; // Ajuste o caminho conforme necessário

@InputType()
export class UsuarioInput {
  @Field({ nullable: true }) // Campo opcional
  token_api?: string;

  @Field()
  senha!: string;

  @Field()
  email!: string;

  @Field()
  telefone!: string;

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

  @Field(() => DateScalar, { nullable: true })
  data_nascimento?: Date;

  @Field()
  nome!: string;

  @Field()
  funcao!: string;

  @Field({ nullable: true })
  usuario_foto?: string;

  @Field(() => TypePerson, { nullable: true })
  tipo_pessoa?: TypePerson;

  @Field(() => [String], { nullable: true })
  tipo_sistemas_nomes?: string[]; // Nomes dos tipos de sistema
}
