import { InputType, Field } from 'type-graphql';
import { DateScalar } from '../../scalars/DateScalar';
import { type_person } from '@prisma/client';

@InputType()
export class FuncionarioInput {
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

  @Field(() => type_person, { nullable: true })
  tipo_pessoa?: type_person;
}
