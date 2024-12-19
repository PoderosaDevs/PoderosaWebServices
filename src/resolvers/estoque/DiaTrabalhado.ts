import { Resolver, Query, Mutation, Arg } from "type-graphql";
import DiaTrabalhadoEstoqueServices from '../../services/estoque/Estoque';
import { DiaTrabalhadoEstoqueModel } from "../../models/estoque/DiaTrabalho";
import { DiaTrabalhadoEstoqueInput, DiaTrabalhadoEstoqueInputUpdate } from "../../inputs/estoque/DiaTrabalho";

@Resolver()
export class DiaTrabalhadoEstoqueResolver {
  
  @Query(() => [DiaTrabalhadoEstoqueModel])
  async GetDiasTrabalhadosEstoque(
    @Arg("usuarioId", { nullable: true }) usuarioId: number,
    @Arg("startDate", { nullable: true }) startDate?: Date,
    @Arg("endDate", { nullable: true }) endDate?: Date
  ) {
    return await DiaTrabalhadoEstoqueServices.get(usuarioId, startDate, endDate);
  }

  @Query(() => [DiaTrabalhadoEstoqueModel])
  async GetAllDiasTrabalhadosEstoque(
    @Arg("singleDate", { nullable: true }) singleDate?: Date,
    @Arg("startDate", { nullable: true }) startDate?: Date,
    @Arg("endDate", { nullable: true }) endDate?: Date
  ) {
    return await DiaTrabalhadoEstoqueServices.getAll(singleDate, startDate, endDate);
  }

  @Query(() => DiaTrabalhadoEstoqueModel, { nullable: true })
  async GetDiaTrabalhadoEstoqueByID(@Arg("id") id: number) {
    return await DiaTrabalhadoEstoqueServices.getById(id);
  }

  @Mutation(() => DiaTrabalhadoEstoqueModel)
  async SetDiaTrabalhadoEstoque(@Arg("data") data: DiaTrabalhadoEstoqueInput) {
    if (!data.horario_entrada || !data.horario_saida || !data.data_trabalho) {
      throw new Error('horario_entrada, horario_saida e data_trabalho são obrigatórios.');
    }
    return await DiaTrabalhadoEstoqueServices.create(data);
  }

  @Mutation(() => DiaTrabalhadoEstoqueModel, { nullable: true })
  async PutDiaTrabalhadoEstoque(@Arg("data") data: DiaTrabalhadoEstoqueInputUpdate) {
    return await DiaTrabalhadoEstoqueServices.update(data);
  }

  @Mutation(() => DiaTrabalhadoEstoqueModel, { nullable: true })
  async DeleteDiaTrabalhadoEstoque(@Arg("id") id: number) {
    return await DiaTrabalhadoEstoqueServices.delete(id);
  }
}
