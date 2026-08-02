import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyToken } from "../utils/jwt";
import { TipoPessoa } from "../types/enums";

/**
 * Exige um Bearer token valido. A API antiga gerava o JWT no login mas NUNCA
 * validava esse token nas demais rotas (qualquer requisicao GraphQL passava
 * sem autenticacao) - aqui isso e corrigido: toda rota, exceto login/health/
 * error-report, exige token valido.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Token de autenticacao ausente.");
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw ApiError.unauthorized("Token invalido ou expirado.");
  }
}

/**
 * Restringe a rota a determinados perfis. A decisao usa SEMPRE o
 * tipo_pessoa vindo do token assinado (req.user), nunca um valor enviado
 * pelo cliente na URL/body - diferente da API antiga, que confiava em um
 * argumento "TipoPessoa" enviado pelo proprio requisitante.
 */
export function authorize(...perfis: TipoPessoa[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    if (!perfis.includes(req.user.tipo_pessoa)) {
      throw ApiError.forbidden();
    }
    next();
  };
}

/**
 * Libera a rota se o usuario autenticado for o dono do recurso (:id na URL
 * bate com req.user.id) OU se o perfil dele estiver na lista informada.
 * Usado para permitir que uma vendedora edite o proprio perfil/senha sem
 * precisar de permissao de ADMIN/MANAGER, sem abrir a rota para editar
 * o perfil de terceiros.
 */
export function authorizeSelfOrRoles(...perfis: TipoPessoa[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }
    const isSelf = Number(req.params.id) === req.user.id;
    if (!isSelf && !perfis.includes(req.user.tipo_pessoa)) {
      throw ApiError.forbidden();
    }
    next();
  };
}
