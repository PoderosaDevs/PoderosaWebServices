import { Request, Response } from "express";
import ProdutoService from "../services/ProdutoService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { nome, marca, categorias, pontos_min, pontos_max, pagina, quantidade } = req.query as Record<
    string,
    string
  >;

  const result = await ProdutoService.get(
    {
      nome,
      marca,
      categorias: categorias ? (Array.isArray(categorias) ? categorias : [categorias]) : undefined,
      pontos_min: pontos_min ? Number(pontos_min) : undefined,
      pontos_max: pontos_max ? Number(pontos_max) : undefined,
    },
    { pagina: pagina ? Number(pagina) : undefined, quantidade: quantidade ? Number(quantidade) : undefined }
  );
  res.json(result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const produto = await ProdutoService.getByID(Number(req.params.id));
  res.json(produto);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const produto = await ProdutoService.create(req.body);
  res.status(201).json(produto);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const produto = await ProdutoService.update(Number(req.params.id), req.body);
  res.json(produto);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProdutoService.delete(Number(req.params.id));
  res.json(result);
});
