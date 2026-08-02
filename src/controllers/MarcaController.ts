import { Request, Response } from "express";
import MarcaService from "../services/MarcaService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await MarcaService.get());
});

export const ranking = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  res.json(
    await MarcaService.getBrandsInsights(startDate, endDate, pagina ? Number(pagina) : 0, quantidade ? Number(quantidade) : 10)
  );
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MarcaService.getById(Number(req.params.id)));
});

export const insights = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  res.json(
    await MarcaService.getBrandSalesById(
      Number(req.params.id),
      startDate,
      endDate,
      pagina ? Number(pagina) : 0,
      quantidade ? Number(quantidade) : 10
    )
  );
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await MarcaService.create(req.body.nome, req.body.cor));
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MarcaService.update(Number(req.params.id), req.body.nome, req.body.cor));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MarcaService.delete(Number(req.params.id)));
});

export const associarProdutos = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MarcaService.associationProdutos(Number(req.params.id), req.body.produtoIds));
});
