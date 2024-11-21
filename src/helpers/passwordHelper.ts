import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(scrypt);

export class PasswordHelper {
  static async  hashPassword(password: string) {
     const salt = randomBytes(16).toString("hex");
     const buf = (await scryptAsync(password, salt, 64)) as Buffer;
     return `${buf.toString("hex")}.${salt}`;
  }

  static async comparePassword(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const hashedPasswordBuf = Buffer.from(hashedPassword, "hex");
    const suppliedPasswordBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return hashedPasswordBuf === suppliedPasswordBuf
  }
}