import { Router } from "express";
import { z } from "zod";
import * as VendaController from "../controllers/VendaController";
import { validate } from "../middlewares/validate";
import { authenticate, authorize } from "../middlewares/auth";
import { TipoPessoa } from "../types/enums";

const router = Router();

const vendaDetalheSchema = z.object({
  id: z.number().optional(),
  produtoId: z.number(),
  quantidade: z.number().int().positive(),
});

const vendaBodySchema = z.object({
  funcionarioId: z.number(),
  lojaId: z.number(),
  vendaDetalhes: z.array(vendaDetalheSchema).min(1, "Informe ao menos um produto."),
  data_venda: z.coerce.date().optional(),
});

router.use(authenticate);

router.get("/", VendaController.list);
router.get("/lojas-insights", VendaController.lojasInsights);
router.get("/:id", VendaController.getById);
router.get("/usuario/:usuarioId", VendaController.getByUsuario);
router.get("/usuario/:usuarioId/count", VendaController.countByUsuario);

router.post("/", validate({ body: vendaBodySchema }), VendaController.create);
router.put(
  "/:id",
  authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER),
  validate({ body: vendaBodySchema.partial() }),
  VendaController.update
);
router.delete("/:id", authorize(TipoPessoa.ADMIN, TipoPessoa.MANAGER), VendaController.remove);

export default router;
