// metaResolver.ts

import {
  Resolver,
  Mutation,
  Query,
  Arg,
  Int,
  Float,
  GraphQLISODateTime,
} from "type-graphql";
import MetaService from "../services/Meta";
import { MetaModel } from "../models/Meta";
import { CreateMetaInput } from "../inputs/Meta";
import { GraphQLString } from "graphql";

@Resolver()
export class MetaResolver {
  // Query para listar todas as metas de um usuário e suas etapas
  @Query(() => [MetaModel])
  async GetMetas(
    @Arg("usuarioId", () => Int) usuarioId: number,

    // ► Agora strings no formato "dd/MM/yyyy"
    @Arg("data_inicio", () => GraphQLString, { nullable: true })
    data_inicio?: string,

    @Arg("data_fim", () => GraphQLString, { nullable: true })
    data_fim?: string
  ) {
    return MetaService.getMetasByUsuario(usuarioId, {
      inicio: data_inicio,
      fim: data_fim,
    });
  }

  @Query(() => MetaModel, { nullable: true })
  async GetMeta(@Arg("metaId", () => Int) metaId: number) {
    return MetaService.getMetaComEtapas(metaId);
  }

  @Mutation(() => MetaModel)
  async SetMeta(@Arg("data", () => CreateMetaInput) data: CreateMetaInput) {
    const res = await MetaService.criarMeta(data);
    return res; // ou retorne res inteiro se quiser o id
  }

  @Mutation(() => String)
  async DeleteMeta(@Arg("metaId", () => Int) metaId: number) {
    const res = await MetaService.deletarMeta(metaId);
    return res.mensagem; // ou retorne res inteiro se quiser o id
  }
}
