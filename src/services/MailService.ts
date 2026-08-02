import nodemailer, { Transporter } from "nodemailer";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface ErrorMailPayload {
  message: string;
  stack?: string;
  path?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: true,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

const lastSentByHash = new Map<string, number>();
const THROTTLE_MS = 10 * 60 * 1000; // 10 min

function hashError({ message, path, url }: ErrorMailPayload): string {
  return `${message}::${path ?? url ?? ""}`;
}

/** Envia um alerta por e-mail para erros 5xx/nao tratados, com throttle por assinatura de erro. */
export async function sendErrorAlert(
  payload: ErrorMailPayload
): Promise<{ sent: boolean; reason?: string }> {
  const mailer = getTransporter();
  if (!mailer || !env.errorAlertEmail) {
    return { sent: false, reason: "smtp-not-configured" };
  }

  const hash = hashError(payload);
  const lastSent = lastSentByHash.get(hash);
  const now = Date.now();

  if (lastSent && now - lastSent < THROTTLE_MS) {
    return { sent: false, reason: "throttled" };
  }
  lastSentByHash.set(hash, now);

  try {
    await mailer.sendMail({
      from: env.smtp.from,
      to: env.errorAlertEmail,
      subject: `Erro em producao: ${payload.message.slice(0, 80)}`,
      html: `
        <h2>Erro capturado em producao</h2>
        <p><strong>Mensagem:</strong> ${payload.message}</p>
        ${payload.path ? `<p><strong>Rota:</strong> ${payload.path}</p>` : ""}
        ${payload.url ? `<p><strong>URL (frontend):</strong> ${payload.url}</p>` : ""}
        <p><strong>User Agent:</strong> ${payload.userAgent ?? "N/A"}</p>
        <p><strong>Usuario:</strong> ${payload.userId ?? "nao autenticado"}</p>
        <p><strong>Horario:</strong> ${new Date().toISOString()}</p>
        <pre style="background:#111;color:#fff;padding:12px;border-radius:6px;overflow:auto;">${
          payload.stack ?? "sem stack trace"
        }</pre>
      `,
    });
    return { sent: true };
  } catch (err) {
    logger.error("Falha ao enviar email de alerta de erro:", err);
    return { sent: false, reason: "send-failed" };
  }
}
