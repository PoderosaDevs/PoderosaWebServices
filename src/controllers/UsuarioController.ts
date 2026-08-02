import { Request, Response } from "express";
import UsuarioService, { InsightTargetType } from "../services/UsuarioService";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { TipoPessoa } from "../types/enums";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const usuarios = await UsuarioService.get(req.query.tipo_pessoa as any);
  res.json(usuarios);
});

export const ranking = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  const result = await UsuarioService.getRankingUserSales(
    startDate,
    endDate,
    pagina ? Number(pagina) : 0,
    quantidade ? Number(quantidade) : 10
  );
  res.json(result);
});

export const pontos = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  const result = await UsuarioService.getUsersPoints(startDate, endDate, {
    pagina: pagina ? Number(pagina) : undefined,
    quantidade: quantidade ? Number(quantidade) : undefined,
  });
  res.json(result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await UsuarioService.getByID(Number(req.params.id));
  res.json(usuario);
});

export const insights = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, pagina, quantidade } = req.query as Record<string, string>;
  const result = await UsuarioService.getUserSalesById(
    Number(req.params.id),
    startDate,
    endDate,
    pagina ? Number(pagina) : 0,
    quantidade ? Number(quantidade) : 10
  );
  res.json(result);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const usuario = await UsuarioService.create(req.body, req.body.tipo_pessoa);
  res.status(201).json(usuario);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const id = Number(req.params.id);
  const privileged = req.user.tipo_pessoa === TipoPessoa.ADMIN || req.user.tipo_pessoa === TipoPessoa.MANAGER;
  if (!privileged && req.user.id !== id) throw ApiError.forbidden();

  const usuario = await UsuarioService.update(id, req.body, req.body.tipo_pessoa, privileged);
  res.json(usuario);
});

export const changeOwnPassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const id = Number(req.params.id);
  if (req.user.id !== id) throw ApiError.forbidden();

  const result = await UsuarioService.changeOwnPassword(id, req.body.senhaAtual, req.body.novaSenha);
  res.json(result);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const result = await UsuarioService.delete(Number(req.params.id), req.user.tipo_pessoa);
  res.json(result);
});

export const recovery = asyncHandler(async (req: Request, res: Response) => {
  const result = await UsuarioService.recovery(Number(req.params.id), req.body.senha);
  res.json(result);
});

export const gastosPeriodos = asyncHandler(async (req: Request, res: Response) => {
  const { targetId, startDate, endDate, type } = req.query as Record<string, string>;
  if (!targetId) throw ApiError.badRequest("targetId e obrigatorio.");

  const result = await UsuarioService.vendasPeriodos(
    Number(targetId),
    startDate,
    endDate,
    (type as InsightTargetType) ?? InsightTargetType.USER
  );
  res.json(result);
});
