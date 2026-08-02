import { Request, Response } from "express";
import AutenticacaoService from "../services/AutenticacaoService";
import { asyncHandler } from "../utils/asyncHandler";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const result = await AutenticacaoService.login(email, senha);
  res.json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ usuario: req.user });
});
