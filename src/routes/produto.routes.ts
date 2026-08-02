import { Router } from "express";
import { z } from "zod";
import * as ProdutoController from "../controllers/ProdutoController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const produtoBodySchema = z.object({
  codigo: z.string().min(1),
  nome: z.string().min(1),
  descricao: z.string().optional(),
  id_marca: z.number().optional(),
  preco: z.number().optional(),
  pontos: z.number().int().optional(),
  situacao: z.boolean(),
  imagem: z.string().optional(),
  categorias: z.array(z.object({ nome: z.string() })).optional(),
});

router.use(authenticate);

router.get("/", ProdutoController.list);
router.get("/:id", ProdutoController.getById);

router.post(
  "/",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: produtoBodySchema }),
  ProdutoController.create
);
router.put(
  "/:id",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: produtoBodySchema.partial() }),
  ProdutoController.update
);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), ProdutoController.remove);

export default router;
