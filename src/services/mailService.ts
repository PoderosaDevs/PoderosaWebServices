import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

interface ErrorMailPayload {
  message: string;
  stack?: string;
  path?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
}

const transporter: Transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const lastSentByHash = new Map<string, number>();
const THROTTLE_MS = 10 * 60 * 1000; // 10 min

function hashError({ message, path, url }: ErrorMailPayload): string {
  return `${message}::${path ?? url ?? ""}`;
}

export async function sendErrorAlert(
  payload: ErrorMailPayload
): Promise<{ sent: boolean; reason?: string }> {
  const hash = hashError(payload);
  const lastSent = lastSentByHash.get(hash);
  const now = Date.now();

  if (lastSent && now - lastSent < THROTTLE_MS) {
    console.warn(`Erro suprimido (throttle): ${payload.message}`);
    return { sent: false, reason: "throttled" };
  }

  lastSentByHash.set(hash, now);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ERROR_ALERT_EMAIL,
    subject: `🔴 Erro em produção: ${payload.message.slice(0, 80)}`,
    html: `
      <h2>Erro capturado em produção</h2>
      <p><strong>Mensagem:</strong> ${payload.message}</p>
      ${payload.path ? `<p><strong>Resolver/Path:</strong> ${payload.path}</p>` : ""}
      ${payload.url ? `<p><strong>URL (frontend):</strong> ${payload.url}</p>` : ""}
      <p><strong>User Agent:</strong> ${payload.userAgent ?? "N/A"}</p>
      <p><strong>Usuário:</strong> ${payload.userId ?? "não autenticado"}</p>
      <p><strong>Horário:</strong> ${new Date().toISOString()}</p>
      <pre style="background:#111;color:#fff;padding:12px;border-radius:6px;overflow:auto;">${payload.stack ?? "sem stack trace"}</pre>
    `,
  });

  return { sent: true };
}