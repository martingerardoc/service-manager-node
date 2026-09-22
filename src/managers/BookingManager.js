import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsPath = path.join(
  __dirname,
  "..",
  "data",
  "bookings.json"
);

const servicesPath = path.join(
  __dirname,
  "..",
  "data",
  "services.json"
);

export class BookingManager {
  constructor() {
    this.bookings = this.loadBookings();
  }

  loadBookings() {
    const data = fs.readFileSync(bookingsPath, "utf-8");
    return JSON.parse(data);
  }

  saveBookings() {
    fs.writeFileSync(
      bookingsPath,
      JSON.stringify(this.bookings, null, 2),
      "utf-8"
    );
  }

  loadServices() {
    const data = fs.readFileSync(servicesPath, "utf-8");
    return JSON.parse(data);
  }

  createBooking(bookingData) {
    const requiredFields = [
      "clientName",
      "clientEmail",
      "date",
      "time",
      "status"
    ];

    const hasAllFields = requiredFields.every(
      (field) =>
        Object.prototype.hasOwnProperty.call(bookingData, field) &&
        bookingData[field] !== null &&
        bookingData[field] !== undefined &&
        bookingData[field] !== ""
    );

    if (!hasAllFields) {
      throw new Error(
        "La reserva debe incluir clientName, clientEmail, date, time y status."
      );
    }

    const newId =
      this.bookings.length > 0
        ? Math.max(...this.bookings.map((booking) => booking.id)) + 1
        : 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status,
      services: []
    };

    this.bookings.push(newBooking);

    this.saveBookings();

    return newBooking;
  }

  getBookingById(id) {
    return (
      this.bookings.find(
        (booking) => booking.id === Number(id)
      ) || null
    );
  }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.getBookingById(bookingId);

    if (!booking) {
      return {
        error: "booking_not_found"
      };
    }

    const services = this.loadServices();

    const service = services.find(
      (item) => item.id === Number(serviceId)
    );

    if (!service) {
      return {
        error: "service_not_found"
      };
    }

    const existingService = booking.services.find(
      (item) => item.service === Number(serviceId)
    );

    if (existingService) {
      existingService.quantity += 1;
    } else {
      booking.services.push({
        service: Number(serviceId),
        quantity: 1
      });
    }

    this.saveBookings();

    return booking;
  }
}