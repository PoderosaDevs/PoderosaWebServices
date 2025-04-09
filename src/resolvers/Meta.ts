// metaResolver.ts

import { Resolver, Mutation, Query, Arg, Int, Float } from "type-graphql";
import MetaService from "../services/Meta";
import { MetaEtapaModel, MetaModel } from "../models/Meta";
import { MetaEtapaInputs, MetaEtapaUpdateInputs } from "../inputs/Meta";

@Resolver()
export class MetaResolver {
  // Query para listar todas as metas de um usuário e suas etapas
  @Query(() => [MetaModel])
  async GetMetas(@Arg("usuarioId", () => Int) usuarioId: number) {
    return MetaService.obterMetasPorUsuario(usuarioId); // Método para obter metas e etapas de um usuário
  }

  // Query para listar uma meta específica e suas etapas
  @Query(() => MetaModel)
  async GetMetaByID(@Arg("id", () => Int) id: number) {
    return MetaService.obterMetaPorId(id); // Método para obter uma meta e suas etapas por ID
  }

  // Mutation para criar uma meta e suas etapas
  // @Mutation(() => MetaModel)
  // async SetMeta(
  //   @Arg("nome") nome: string,
  //   @Arg("descricao", { nullable: true }) descricao: string,
  //   @Arg("usuarioId", () => Int) usuarioId: number,
  //   @Arg("pontos_objetivo", () => Float) pontos_objetivo: number,
  //   @Arg("marcaId", () => Int, { nullable: true }) marcaId: number,
  //   @Arg("etapas", () => [MetaEtapaInputs])
  //   etapas: {
  //     etapa_numero: number;
  //     quantidade: number;
  //     recompensa: string;
  //     valor: number;
  //     importancia: number;
  //   }[]
  // ) {
  //   return MetaService.criarMetaComEtapas({
  //     nome,
  //     descricao,
  //     usuario_id: usuarioId,
  //     pontos_objetivo,
  //     marcaId,
  //     etapas,
  //   });
  // }

  // Mutation para atualizar as etapas de uma meta
  @Mutation(() => [MetaEtapaModel])
  async PutMetaEtapas(
    @Arg("metaId", () => Int) metaId: number,
    @Arg("etapas", () => [MetaEtapaUpdateInputs])
    etapas: MetaEtapaUpdateInputs[] // Usando MetaEtapaUpdateInputs como tipo de entrada
  ) {
    return MetaService.atualizarEtapas(metaId, etapas);
  }

  // Mutation para excluir uma meta e suas etapas
  @Mutation(() => Boolean)
  async DeleteMeta(@Arg("id", () => Int) id: number) {
    try {
      await MetaService.deletarMetaComEtapas(id); // Exclui meta e etapas associadas
      return true;
    } catch {
      return false;
    }
  }
}
