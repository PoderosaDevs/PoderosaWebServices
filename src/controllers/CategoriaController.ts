import { Request, Response } from "express";
import CategoriaService from "../services/CategoriaService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await CategoriaService.get());
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json(await CategoriaService.getByID(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await CategoriaService.create(req.body.nome));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json(await CategoriaService.update(Number(req.params.id), req.body.nome));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(await CategoriaService.delete(Number(req.params.id)));
});
