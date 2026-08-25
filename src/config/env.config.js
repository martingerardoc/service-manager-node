import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["PORT", "NODE_ENV"];

for (const variable of requiredVariables) {
  if (!process.env[variable] || process.env[variable].trim() === "") {
    throw new Error(
      `Falta la variable de entorno requerida: ${variable}. ` +
      `Crea un archivo .env basado en .env.example.`
    );
  }
}

export const env = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV
};

if (!Number.isInteger(env.PORT) || env.PORT <= 0) {
  throw new Error("La variable PORT debe ser un número entero mayor que 0.");
}