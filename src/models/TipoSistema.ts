import { ObjectType, Field, ID } from 'type-graphql';
import { UsuarioModel } from './Usuario'; // Ajuste o caminho conforme necessário

@ObjectType()
export class TipoSistemaModel {
  @Field(() => ID)
  id!: number;

  @Field()
  nome!: string;

  @Field(() => [UsuarioModel], { nullable: true })
  usuarios?: UsuarioModel[];
}
