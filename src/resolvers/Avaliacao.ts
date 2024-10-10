// src/resolvers/AvaliacaoResolver.ts
import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { AvaliacaoModel } from '../models/Avaliacao';
import AvaliacaoService from '../services/Avaliacao';
import { AvaliacaoInput } from '../inputs/Avaliacao';

@Resolver(() => AvaliacaoModel)
export class AvaliacaoResolver {

  @Query(() => [AvaliacaoModel])
  async GetAvaliacoes() {
    const avaliacoes = await AvaliacaoService.get();
    return avaliacoes;
  }

  @Query(() => AvaliacaoModel, { nullable: true })
  async GetAvaliacaoByID(@Arg('id') id: number) {
    const avaliacoes = await AvaliacaoService.getByID(id);
  }

  @Mutation(() => AvaliacaoModel)
  async SetAvaliacao(@Arg('data') data: AvaliacaoInput) {
    const avaliacao = await AvaliacaoService.create(data);
    return avaliacao;
  }

  @Mutation(() => AvaliacaoModel, { nullable: true })
  async PutAvaliacao(
    @Arg('id') id: number,
    @Arg('data') data: AvaliacaoInput
  ) {
    const avaliacao = await AvaliacaoService.update(id, data);
    return avaliacao;
  }

  @Mutation(() => Boolean)
  async DeleteAvaliacao(@Arg('id') id: number) {
    const avaliacao = await AvaliacaoService.delete(id);
    return avaliacao
  }
}
