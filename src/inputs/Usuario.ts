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

  @Field({ nullable: true })
  tema?: string;

  @Field({ nullable: true })
  telefone?: string;

  @Field({ nullable: true })
  cpf?: string;

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

}

@InputType()
export class UsuarioFiltroInput {
  @Field(() => DateScalar, { nullable: true })
  data_inicio?: Date;

  @Field(() => DateScalar, { nullable: true })
  data_fim?: Date;
}