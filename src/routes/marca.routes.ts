import { Router } from "express";
import { z } from "zod";
import * as MarcaController from "../controllers/MarcaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const marcaBodySchema = z.object({ nome: z.string().min(1), cor: z.string().min(1) });
const associarSchema = z.object({ produtoIds: z.array(z.number()).min(1) });

router.use(authenticate);

router.get("/", MarcaController.list);
router.get("/ranking", MarcaController.ranking);
router.get("/:id", MarcaController.getById);
router.get("/:id/insights", MarcaController.insights);

router.post("/", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: marcaBodySchema }), MarcaController.create);
router.put("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: marcaBodySchema }), MarcaController.update);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), MarcaController.remove);
router.post(
  "/:id/produtos",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: associarSchema }),
  MarcaController.associarProdutos
);

export default router;
