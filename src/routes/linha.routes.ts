import { Router } from "express";
import { z } from "zod";
import * as LinhaController from "../controllers/LinhaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const createSchema = z.object({
  nome: z.string().min(1),
  marcaId: z.number(),
  produtosIds: z.array(z.number()).optional(),
});
const updateSchema = z.object({ nome: z.string().min(1) });

router.use(authenticate);

router.get("/", LinhaController.list);
router.get("/:id", LinhaController.getById);
router.post("/", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: createSchema }), LinhaController.create);
router.put("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: updateSchema }), LinhaController.update);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), LinhaController.remove);

export default router;
