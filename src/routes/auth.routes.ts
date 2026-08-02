import { Router } from "express";
import { z } from "zod";
import * as AuthController from "../controllers/AuthController";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Email invalido."),
  senha: z.string().min(1, "Senha obrigatoria."),
});

router.post("/login", validate({ body: loginSchema }), AuthController.login);
router.get("/me", authenticate, AuthController.me);

export default router;
