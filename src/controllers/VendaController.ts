import { Request, Response } from "express";
import VendaService from "../services/VendaService";
import { asyncHandler } from "../utils/asyncHandler";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, funcionarioId, lojaId } = req.query as Record<string, string>;
  const vendas = await VendaService.get(
    startDate,
    endDate,
    funcionarioId ? Number(funcionarioId) : undefined,
    lojaId ? Number(lojaId) : undefined
  );
  res.json(vendas);
});

export const lojasInsights = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  const result = await VendaService.getStoresInsights(
    startDate,
    endDate,
    pagina ? Number(pagina) : 0,
    quantidade ? Number(quantidade) : 10
  );
  res.json(result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const venda = await VendaService.getByID(Number(req.params.id));
  res.json(venda);
});

export const getByUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { data_mensal } = req.query as Record<string, string>;
  const vendas = await VendaService.getByUserID(Number(req.params.usuarioId), data_mensal);
  res.json(vendas);
});

export const countByUsuario = asyncHandler(async (req: Request, res: Response) => {
  const count = await VendaService.countByFuncionario(Number(req.params.usuarioId));
  res.json({ count });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const venda = await VendaService.create(req.body);
  res.status(201).json(venda);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const venda = await VendaService.update(Number(req.params.id), req.body);
  res.json(venda);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const venda = await VendaService.delete(Number(req.params.id));
  res.json(venda);
});
