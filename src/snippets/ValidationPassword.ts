import bcryptjs from "bcryptjs";

export async function PasswordValidation(password: string, hashPassword: string) {
  const isValid = await bcryptjs.compare(password, hashPassword);

  if (!isValid) {
    return false;
  } else {
    return true;
  }
}

export async function HashPassword(password: string, lengthCharacters: number){
  const hashedPassword = await bcryptjs.hash(password, lengthCharacters);

  return hashedPassword;
}