import { ObjectType, Field, ID } from 'type-graphql';
import { TypePerson } from '../../enums/TypePerson';
import { DiaTrabalhadoEstoqueModel } from './DiaTrabalho';
import { TipoSistemaModel } from '../TipoSistema';

@ObjectType()
export class FuncionarioModel {
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

  // Adicionando o relacionamento com Tipo_Sistema
  @Field(() => [TipoSistemaModel], { nullable: true })
  tipo_sistema?: TipoSistemaModel[];

  @Field(() => [DiaTrabalhadoEstoqueModel], { nullable: true }) // Campo para dias trabalhados
  dias_trabalhados_estoque?: DiaTrabalhadoEstoqueModel[]; // Relacionamento com os dias trabalhados
}
