import { env } from "./config/env.config.js";
import { ServiceManager } from "./managers/ServiceManager.js";

const serviceManager = new ServiceManager();

console.log("Service Manager iniciado correctamente");
console.log(`PORT: ${env.PORT}`);
console.log(`NODE_ENV: ${env.NODE_ENV}`);

console.log("\n--- Todos los servicios ---");
console.log(serviceManager.getServices());

console.log("\n--- Servicio con ID 1 ---");
console.log(serviceManager.getServiceById(1));

console.log("\n--- Agregar servicio ---");

const newService = serviceManager.addService({
  name: "Mantenimiento preventivo",
  description: "Servicio de mantenimiento preventivo para equipos.",
  duration: 90,
  price: 20000,
  category: "Mantenimiento",
  available: true
});

console.log(newService);

console.log("\n--- Actualizar servicio ---");

const updatedService = serviceManager.updateService(newService.id, {
  price: 22000,
  available: false
});

console.log(updatedService);

console.log("\n--- Eliminar servicio ---");

const deletedService = serviceManager.deleteService(newService.id);

console.log(deletedService);

console.log("\n--- Servicios finales ---");
console.log(serviceManager.getServices());
