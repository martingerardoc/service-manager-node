import app from "./app.js";
import { env } from "./config/env.config.js";

app.listen(env.PORT, () => {
  console.log("Service Manager iniciado correctamente");
  console.log(`PORT: ${env.PORT}`);
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
});