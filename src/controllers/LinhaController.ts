import { Request, Response } from "express";
import LinhaService from "../services/LinhaService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { pagina, quantidade } = req.query as Record<string, string>;
  res.json(await LinhaService.get({ pagina: pagina ? Number(pagina) : undefined, quantidade: quantidade ? Number(quantidade) : undefined }));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LinhaService.getById(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await LinhaService.create(req.body));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LinhaService.update(Number(req.params.id), req.body.nome));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LinhaService.delete(Number(req.params.id)));
});
