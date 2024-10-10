import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { UsuarioModel } from '../models/Usuario'; // Ajuste o caminho conforme necessário
import { UsuarioInput } from '../inputs/Usuario';
import UsuarioService from '../services/Usuario';
import { TypeSystem } from '../enums/TypeSystem';
import { TypePerson } from '../enums/TypePerson';

@Resolver(() => UsuarioModel)
export class UsuarioResolver {

  @Query(() => [UsuarioModel])
  async GetUsuarios(
    @Arg('Tipo_Sistema', { nullable: true }) tipo_sistema?: TypeSystem,
    @Arg('Tipo_Pessoa', { nullable: true }) tipo_pessoa?: TypePerson
  ) {
    const users = await UsuarioService.get(tipo_sistema, tipo_pessoa); // Passa os filtros para o serviço
    return users; // Retorna a lista diretamente
  }
  

  @Query(() => UsuarioModel, { nullable: true })
  async GetUsuarioByID(@Arg('id') id: number) {
    const user = UsuarioService.getByID(id);

    return user;
  }

  @Mutation(() => UsuarioModel)
  async SetUsuario(@Arg('data') data: UsuarioInput) {
    const usuario = await UsuarioService.create(data);

    return usuario;
  }

  @Mutation(() => UsuarioModel, { nullable: true })
  async PutUsuario(
    @Arg('id') id: number,
    @Arg('data') data: UsuarioInput
  ) {
    const usuario = await UsuarioService.update(id, data);

    return usuario;
  }

  @Mutation(() => UsuarioModel, { nullable: true })
  async DeleteUsuario(
    @Arg('id') id: number
  ) {
    const usuario = UsuarioService.delete(id);

    return usuario;
  }
}
