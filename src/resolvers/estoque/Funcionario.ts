import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { FuncionarioModel } from '../../models/estoque/Funcionario';
import FuncionarioService from '../../services/estoque/Funcionario'
import { FuncionarioInput } from '../../inputs/estoque/Usuario';

@Resolver(() => FuncionarioModel)
export class FuncionarioResolver {

  @Query(() => [FuncionarioModel])
  async GetFuncionariosEstoque() {
    const employees = await FuncionarioService.getStock(); // Espera receber diretamente a lista de usuários
    return employees; // Retorna a lista diretamente
  }
}
