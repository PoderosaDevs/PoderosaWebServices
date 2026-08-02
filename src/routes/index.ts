import { Router } from "express";
import authRoutes from "./auth.routes";
import usuarioRoutes from "./usuario.routes";
import vendaRoutes from "./venda.routes";
import produtoRoutes from "./produto.routes";
import categoriaRoutes from "./categoria.routes";
import marcaRoutes from "./marca.routes";
import linhaRoutes from "./linha.routes";
import lojaRoutes from "./loja.routes";
import metaRoutes from "./meta.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/vendas", vendaRoutes);
router.use("/produtos", produtoRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/marcas", marcaRoutes);
router.use("/linhas", linhaRoutes);
router.use("/lojas", lojaRoutes);
router.use("/metas", metaRoutes);

export default router;
