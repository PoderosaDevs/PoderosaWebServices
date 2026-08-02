import { Request, Response } from "express";
import MetaService from "../services/MetaService";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

export const listByUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { usuarioId, data_inicio, data_fim } = req.query as Record<string, string>;

  if (!usuarioId) {
    // Sem usuarioId: apenas ADMIN/MANAGER podem listar todas as metas
    // (visao de gestao). Vendedoras sempre devem informar o proprio ID.
    if (!req.user || (req.user.tipo_pessoa !== "ADMIN" && req.user.tipo_pessoa !== "MANAGER")) {
      throw ApiError.badRequest("usuarioId e obrigatorio.");
    }
    res.json(await MetaService.listarTodas());
    return;
  }

  res.json(await MetaService.getMetasByUsuario(Number(usuarioId), { inicio: data_inicio, fim: data_fim }));
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MetaService.getMetaComEtapas(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json(await MetaService.criarMeta(req.body));
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json(await MetaService.deletarMeta(Number(req.params.id)));
});
