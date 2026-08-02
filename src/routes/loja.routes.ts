import { Router } from "express";
import { z } from "zod";
import * as LojaController from "../controllers/LojaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const createSchema = z.object({ nome_fantasia: z.string().min(1), razao_social: z.string().min(1) });
const updateSchema = createSchema.partial();

router.use(authenticate);

router.get("/", LojaController.list);
router.get("/ranking", LojaController.ranking);
router.get("/:id", LojaController.getById);
router.get("/:id/insights", LojaController.insights);

router.post("/", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: createSchema }), LojaController.create);
router.put("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: updateSchema }), LojaController.update);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), LojaController.remove);

export default router;
