import { Router } from "express";
import { z } from "zod";
import * as UsuarioController from "../controllers/UsuarioController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize, authorizeSelfOrRoles } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const usuarioBodySchema = z.object({
  senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres.").optional(),
  email: z.string().email(),
  nome: z.string().min(1),
  funcao: z.string().optional(),
  cpf: z.string().optional(),
  tema: z.string().optional(),
  complemento: z.string().optional(),
  usuario_foto: z.string().optional(),
  data_nascimento: z.coerce.date().optional(),
  tipo_pessoa: z.nativeEnum(TipoPessoa).optional(),
});

const recoverySchema = z.object({ senha: z.string().min(6) });
const changeOwnPasswordSchema = z.object({
  senhaAtual: z.string().min(1, "Informe a senha atual."),
  novaSenha: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres."),
});

router.use(authenticate);

router.get("/", UsuarioController.list);
router.get("/ranking", UsuarioController.ranking);
router.get("/pontos", UsuarioController.pontos);
router.get("/timeline", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), UsuarioController.gastosPeriodos);
router.get("/:id", UsuarioController.getById);
router.get("/:id/insights", UsuarioController.insights);

router.post(
  "/",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: usuarioBodySchema }),
  UsuarioController.create
);
router.put(
  "/:id",
  authorizeSelfOrRoles(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: usuarioBodySchema.partial() }),
  UsuarioController.update
);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), UsuarioController.remove);
router.post(
  "/:id/recovery-senha",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: recoverySchema }),
  UsuarioController.recovery
);
router.post(
  "/:id/senha",
  authorizeSelfOrRoles(),
  validate({ body: changeOwnPasswordSchema }),
  UsuarioController.changeOwnPassword
);

export default router;
