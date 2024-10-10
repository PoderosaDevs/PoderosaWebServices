import { ObjectType, Field, Int, Float } from 'type-graphql';
import { VendaDetalhe } from './VendaDetalhe';
import { UsuarioModel } from '../Usuario';
import { LojaModel } from './Loja';

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
