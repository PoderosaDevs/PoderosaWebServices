// src/utils/emailService.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.localweb.com.br", // Servidor SMTP do LocalWeb
  port: 587, // Porta para envio (geralmente 587 ou 465)
  secure: false, // Defina como true se estiver usando a porta 465
  auth: {
    user: "developer@poderosabeleza.com.br", // seu e-mail LocalWeb
    pass: "Poderosa@2024!", // sua senha
  },
});

// Função para enviar email
export const sendWelcomeEmail = async (to: string, name: string) => {
  const mailOptions = {
    from: '"Poderosa Beleza" <developer@poderosabeleza.com.br>', // Remetente
    to, // destinatário
    subject: "Bem-vindo ao Poderosa Beleza!",
    text: `Olá ${name},\n\nBem-vindo ao Poderosa Beleza! Estamos felizes em tê-lo conosco.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
  }
};
