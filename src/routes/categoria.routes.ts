import { Router } from "express";
import { z } from "zod";
import * as CategoriaController from "../controllers/CategoriaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();
const bodySchema = z.object({ nome: z.string().min(1) });

router.use(authenticate);

router.get("/", CategoriaController.list);
router.get("/:id", CategoriaController.getById);
router.post("/", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: bodySchema }), CategoriaController.create);
router.put("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), validate({ body: bodySchema }), CategoriaController.update);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), CategoriaController.remove);

export default router;
