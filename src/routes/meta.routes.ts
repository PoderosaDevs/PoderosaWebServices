import { Router } from "express";
import { z } from "zod";
import * as MetaController from "../controllers/MetaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const etapaSchema = z.object({ nome: z.string().min(1), quantidade_objetivo: z.number().int() });
const createSchema = z.object({
  nome: z.string().min(1),
  marcaId: z.number(),
  quantidade_objetivo: z.number().int().positive(),
  data_inicio: z.coerce.date(),
  data_fim: z.coerce.date(),
  usuarioIds: z.array(z.number()).min(1),
  descricao: z.string().optional(),
  etapas: z.array(etapaSchema).optional(),
});

router.use(authenticate);

router.get("/", MetaController.listByUsuario);
router.get("/:id", MetaController.getById);
router.post("/", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: createSchema }), MetaController.create);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), MetaController.remove);

export default router;
