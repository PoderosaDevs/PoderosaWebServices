import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { FuncionarioModel } from '../../models/estoque/Funcionario';
import FuncionarioService from '../../services/estoque/Funcionario'
import { FuncionarioInput } from '../../inputs/estoque/Usuario';

@Resolver(() => FuncionarioModel)
export class FuncionarioResolver {

  @Query(() => [FuncionarioModel])
  async GetFuncionarios() {
    const employees = await FuncionarioService.get(); // Espera receber diretamente a lista de usuários
    return employees; // Retorna a lista diretamente
  }

  @Query(() => FuncionarioModel, { nullable: true })
  async GetFuncionarioByID(@Arg('id') id: number) {
    const employee = FuncionarioService.getByID(id);

    return employee;
  }

  @Mutation(() => FuncionarioModel)
  async SetFuncionario(@Arg('data') data: FuncionarioInput) {
    const employee = await FuncionarioService.create(data);

    return employee;
  }

  @Mutation(() => FuncionarioModel, { nullable: true })
  async PutFuncionario(
    @Arg('id') id: number,
    @Arg('data') data: FuncionarioInput
  ) {
    const employee = await FuncionarioService.update(id, data);

    return employee;
  }

  @Mutation(() => FuncionarioModel, { nullable: true })
  async DeleteFuncionario(
    @Arg('id') id: number
  ) {
    const employee = FuncionarioService.delete(id);

    return employee;
  }
}
