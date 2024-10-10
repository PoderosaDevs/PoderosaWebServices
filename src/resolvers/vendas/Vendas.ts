import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { VendaModel } from "../../models/vendas/Vendas";
import VendaServices from "../../services/vendas/Vendas";
import { VendaInput } from "../../inputs/vendas/Vendas";
@Resolver()
export class VendaResolver {
  @Query(() => [VendaModel])
  async GetVendas(
    @Arg("startDate", { nullable: true }) startDate?: Date,
    @Arg("endDate", { nullable: true }) endDate?: Date
  ) {
    const vendas = await VendaServices.get(startDate, endDate); // Passa as datas como parâmetros
    return vendas.map((venda) => ({
      ...venda,
      venda_detalhe: venda.venda_detalhe || [], // Garante que venda_detalhe nunca seja null
    }));
  }

  @Query(() => VendaModel, { nullable: true })
  async GetVendaByID(@Arg("id") id: number) {
    return await VendaServices.getByID(id);
  }

  @Query(() => [VendaModel], { nullable: true })
  async GetVendaByUsuarioID(@Arg("id") id: number) {
    return await VendaServices.getByUserID(id);
  }

  @Mutation(() => VendaModel)
  async SetVenda(@Arg("data") data: VendaInput) {
    return await VendaServices.create(data);
  }

  @Mutation(() => VendaModel, { nullable: true })
  async PutVenda(@Arg("id") id: number, @Arg("data") data: VendaInput) {
    return await VendaServices.update(id, data);
  }

  @Mutation(() => VendaModel, { nullable: true })
  async DeleteVenda(@Arg("id") id: number) {
    return await VendaServices.delete(id);
  }
}
