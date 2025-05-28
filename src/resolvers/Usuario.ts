import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
  UsuarioInsightsResult,
  UsuarioModel,
  UsuarioPontosModel,
  UsuarioPontosResult,
} from "../models/Usuario"; // Ajuste o caminho conforme necessário
import {
  UsuarioInput,
  UsuarioFiltroInput,
  UsuarioInsightsFiltroInput,
  RankingUsuariosFiltroInput,
} from "../inputs/Usuario";
import UsuarioService from "../services/Usuario";
import { TypeSystem } from "../enums/TypeSystem";
import { TypePerson } from "../enums/TypePerson";
import { type_person } from "@prisma/client";
import { Pagination } from "../inputs/Utils";

@Resolver(() => UsuarioModel)
export class UsuarioResolver {
  @Query(() => [UsuarioModel])
  async GetUsuarios(
    @Arg("Tipo_Pessoa", { nullable: true }) tipo_pessoa?: TypePerson
  ) {
    const users = await UsuarioService.get(tipo_pessoa); // Passa os filtros para o serviço
    return users; // Retorna a lista diretamente
  }

  @Query(() => UsuarioPontosResult) // ✅ NÃO é uma lista ([]), pois retorna um objeto
  async GetRankingUsuarios(
    @Arg("filters", { nullable: true }) filters?: RankingUsuariosFiltroInput
  ) {
    return await UsuarioService.getRankingUserSales(
      filters?.startDate,
      filters?.endDate,
      filters?.pagina ?? 0,
      filters?.quantidade ?? 10
    ); // ✅ Retorna um único objeto
  }

  @Query(() => UsuarioInsightsResult)
  async GetUsuariosInsights(
    @Arg("filters", { nullable: true }) filters?: UsuarioInsightsFiltroInput
  ) {
    return await UsuarioService.getUserSalesById(
      filters!.userId!,
      filters?.startDate,
      filters?.endDate,
      filters?.pagina ?? 0,
      filters?.quantidade ?? 10
    );
  }

  @Query(() => UsuarioModel, { nullable: true })
  async GetUsuarioByID(@Arg("id") id: number) {
    const user = UsuarioService.getByID(id);

    return user;
  }

  @Mutation(() => UsuarioModel)
  async SetAdmin(@Arg("data") data: UsuarioInput) {
    const usuario = await UsuarioService.create(data, "ADMIN");

    return usuario;
  }

  @Mutation(() => UsuarioModel)
  async SetVendedor(@Arg("data") data: UsuarioInput) {
    const usuario = await UsuarioService.create(data, "EMPLOYEE");

    return usuario;
  }

  @Mutation(() => UsuarioModel, { nullable: true })
  async PutUsuario(
    @Arg("id") id: number,
    @Arg("Data") data: UsuarioInput,
    @Arg("TipoPessoa") type_person: type_person
  ) {
    const usuario = await UsuarioService.update(id, data, type_person);

    return usuario;
  }

  @Mutation(() => UsuarioModel, { nullable: true })
  async DeleteUsuario(
    @Arg("id") id: number,
    @Arg("TipoPessoa") type_person: type_person
  ) {
    const usuario = UsuarioService.delete(id, type_person);

    return usuario;
  }
}
