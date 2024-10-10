import { ObjectType, Field, ID, Int } from 'type-graphql';
import { TypePerson } from '../../enums/TypePerson';

@ObjectType()
export class FuncionarioModel {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  api_token?: string;

  @Field()
  password!: string;

  @Field()
  email!: string;

  @Field()
  phone!: string;

  @Field()
  uuid!: string;

  @Field()
  isWhatsapp!: boolean;

  @Field({ nullable: true })
  cep?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  number?: string;

  @Field({ nullable: true })
  complement?: string;

  @Field({ nullable: true })
  theme?: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field()
  situacao!: boolean;

  @Field()
  created_at!: Date;

  @Field({ nullable: true })
  deleted_at?: Date;

  @Field()
  updated_at!: Date;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field()
  name!: string;

  @Field()
  role!: string;

  @Field(() => TypePerson, { nullable: true })
  type_person?: TypePerson;
}
