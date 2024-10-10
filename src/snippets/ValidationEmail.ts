import { prisma } from "../database"

export async function EmailValidation(email: string) {
  const user = await prisma.usuario.findFirst({
    where: { email, situacao: true }
  });

  if (!user) {
    return { emailValid: false };
  }

  return { emailValid: true, data: user };
}