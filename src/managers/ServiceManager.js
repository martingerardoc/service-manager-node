import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(
  __dirname,
  "..",
  "data",
  "services.json"
);

export class ServiceManager {
  constructor() {
    this.services = this.loadServices();
  }

  loadServices() {
    const data = fs.readFileSync(servicesPath, "utf-8");
    return JSON.parse(data);
  }

  saveServices() {
    fs.writeFileSync(
      servicesPath,
      JSON.stringify(this.services, null, 2),
      "utf-8"
    );
  }

  getServices() {
    return this.services;
  }

  getServiceById(id) {
    return (
      this.services.find((service) => service.id === Number(id)) || null
    );
  }

  addService(serviceData) {
    const requiredFields = [
      "name",
      "description",
      "duration",
      "price",
      "category",
      "available"
    ];

    const hasAllFields = requiredFields.every(
      (field) =>
        Object.prototype.hasOwnProperty.call(serviceData, field) &&
        serviceData[field] !== null &&
        serviceData[field] !== undefined &&
        serviceData[field] !== ""
    );

    if (!hasAllFields) {
      throw new Error(
        "El servicio debe incluir name, description, duration, price, category y available."
      );
    }

    const newId =
      this.services.length > 0
        ? Math.max(...this.services.map((service) => service.id)) + 1
        : 1;

    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available
    };

    this.services.push(newService);

    this.saveServices();

    return newService;
  }

  updateService(id, updatedData) {
    const service = this.getServiceById(id);

    if (!service) {
      return null;
    }

    const { id: ignoredId, ...dataToUpdate } = updatedData;

    Object.assign(service, dataToUpdate);

    this.saveServices();

    return service;
  }

  deleteService(id) {
    const index = this.services.findIndex(
      (service) => service.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    const [deletedService] = this.services.splice(index, 1);

    this.saveServices();

    return deletedService;
  }
}