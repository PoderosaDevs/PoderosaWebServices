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

  @Query(() => FuncionarioModel)
  async GetFuncionarioEstoqueByID(
    @Arg('usuarioId', () => Number) usuarioId: number // Define o argumento usuarioId como um número
  ) {
    const employee = await FuncionarioService.getByID(usuarioId); // Passa o usuarioId para o serviço
    return employee
  }
}
