import { Request, Response } from "express";
import LojaService from "../services/LojaService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { pagina, quantidade } = req.query as Record<string, string>;
  res.json(await LojaService.get({ pagina: pagina ? Number(pagina) : undefined, quantidade: quantidade ? Number(quantidade) : undefined }));
});

export const ranking = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  res.json(
    await LojaService.getRanking(startDate, endDate, pagina ? Number(pagina) : 0, quantidade ? Number(quantidade) : 10)
  );
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LojaService.getById(Number(req.params.id)));
});

export const insights = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  res.json(
    await LojaService.getStoreSalesById(
      Number(req.params.id),
      startDate,
      endDate,
      pagina ? Number(pagina) : 0,
      quantidade ? Number(quantidade) : 10
    )
  );
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await LojaService.create(req.body));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LojaService.update(Number(req.params.id), req.body));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(await LojaService.deleteLoja(Number(req.params.id)));
});
