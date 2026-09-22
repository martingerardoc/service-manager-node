# Service Manager Node

## Descripción

Service Manager Node es un proyecto desarrollado con Node.js y ECMAScript Modules (ESM) para gestionar servicios de un sistema de turnos y reservas.

El proyecto implementa una clase `ServiceManager` que permite consultar, agregar, actualizar y eliminar servicios almacenados inicialmente en un archivo JSON.

## Tecnologías utilizadas

* Node.js
* ECMAScript Modules (ESM)
* dotenv
* JavaScript
* JSON

## Estructura del proyecto

```text
service-manager-node/
│
├── src/
│   ├── config/
│   │   └── env.config.js
│   │
│   ├── managers/
│   │   └── ServiceManager.js
│   │
│   ├── data/
│   │   └── services.json
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Instalación

Clonar el repositorio y acceder a la carpeta del proyecto:

```bash
git clone https://github.com/martingerardoc/service-manager-node.git
cd service-manager-node
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

El proyecto utiliza las siguientes variables de entorno:

```text
PORT=8080
NODE_ENV=development
```

Crear un archivo `.env` en la raíz del proyecto:

```text
PORT=8080
NODE_ENV=development
```

También se incluye el archivo `.env.example` como referencia.

El archivo `.env` no debe subirse al repositorio porque contiene configuración local.

## Ejecución

Para iniciar el proyecto:

```bash
npm start
```

Para ejecutar el proyecto en modo desarrollo utilizando el modo watch de Node.js:

```bash
npm run dev
```

Al iniciar correctamente, la aplicación muestra información de configuración y ejemplos de operaciones realizadas mediante `ServiceManager`.



## Recurso Services

Los servicios se encuentran inicialmente almacenados en:

```text
src/data/services.json
```

Cada servicio tiene la siguiente estructura:

```js
{
  id,
  name,
  description,
  duration,
  price,
  category,
  available
}
```

### Ejemplo

```js
{
  id: 1,
  name: "Consulta inicial",
  description: "Primera consulta para conocer las necesidades del cliente.",
  duration: 60,
  price: 15000,
  category: "Consultoría",
  available: true
}
```

### Propiedades

| Propiedad     | Tipo    | Descripción                           |
| ------------- | ------- | ------------------------------------- |
| `id`          | Number  | Identificador único del servicio      |
| `name`        | String  | Nombre del servicio                   |
| `description` | String  | Descripción del servicio              |
| `duration`    | Number  | Duración del servicio en minutos      |
| `price`       | Number  | Precio del servicio                   |
| `category`    | String  | Categoría del servicio                |
| `available`   | Boolean | Indica si el servicio está disponible |

Endpoints de Services
Obtener todos los servicios
GET /api/services

También permite filtrar por categoría:

GET /api/services?category=Consultoría

Y por disponibilidad:

GET /api/services?available=true
Obtener un servicio por ID
GET /api/services/:sid

Ejemplo:

GET /api/services/1
Crear un servicio
POST /api/services

Ejemplo de body:

{
  "name": "Mantenimiento preventivo",
  "description": "Servicio de mantenimiento preventivo para equipos.",
  "duration": 90,
  "price": 20000,
  "category": "Mantenimiento",
  "available": true
}

El id se genera automáticamente y no debe enviarse en el body.

Respuesta exitosa:

201 Created
Actualizar un servicio
PUT /api/services/:sid

Ejemplo:

PUT /api/services/4

Body:

{
  "price": 22000,
  "available": false
}

El id no puede modificarse.

Eliminar un servicio
DELETE /api/services/:sid

Ejemplo:

DELETE /api/services/4

Los cambios realizados mediante POST, PUT y DELETE se persisten en services.json.

Bookings

Las reservas se almacenan en:

src/data/bookings.json

Cada reserva tiene la siguiente estructura:

{
  "id": 1,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-09-25",
  "time": "10:30",
  "status": "pending",
  "services": []
}
Propiedades
Propiedad	Tipo	Descripción
id	Number	Identificador único generado automáticamente
clientName	String	Nombre del cliente
clientEmail	String	Correo electrónico del cliente
date	String	Fecha de la reserva
time	String	Hora de la reserva
status	String	Estado de la reserva
services	Array	Servicios asociados a la reserva

Los servicios asociados se almacenan utilizando el siguiente formato:

{
  "service": 4,
  "quantity": 1
}

Si el mismo servicio se agrega nuevamente a la reserva, se incrementa quantity en lugar de crear otro elemento.

Por ejemplo:

{
  "services": [
    {
      "service": 4,
      "quantity": 3
    }
  ]
}
Endpoints de Bookings
Crear una reserva
POST /api/bookings

Ejemplo de body:

{
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-09-25",
  "time": "10:30",
  "status": "pending"
}

El id se genera automáticamente y el campo services se inicializa como un array vacío.

Respuesta exitosa:

201 Created
Obtener una reserva por ID
GET /api/bookings/:bid

Ejemplo:

GET /api/bookings/1

Si la reserva no existe, se devuelve:

404 Not Found
Agregar un servicio a una reserva
POST /api/bookings/:bid/services/:sid

Ejemplo:

POST /api/bookings/1/services/4

El endpoint valida que:

La reserva exista.
El servicio exista.
Si el servicio ya está asociado a la reserva, se incremente quantity.
Si no está asociado, se agregue con quantity: 1.

Ejemplo de resultado:

{
  "id": 1,
  "clientName": "Juan Pérez",
  "clientEmail": "juan@example.com",
  "date": "2026-09-25",
  "time": "10:30",
  "status": "pending",
  "services": [
    {
      "service": 4,
      "quantity": 1
    }
  ]
}

Los cambios realizados en las reservas se persisten en bookings.json.

# Managers

## ServiceManager

La clase `ServiceManager` se encuentra en:

```text
src/managers/ServiceManager.js
```

### `getServices()`

Devuelve todos los servicios disponibles.

```js
const services = serviceManager.getServices();
console.log(services);
```

### `getServiceById(id)`

Busca un servicio mediante su identificador.

```js
const service = serviceManager.getServiceById(1);
console.log(service);
```

Si el servicio no existe, devuelve `null`.

### `addService(serviceData)`

Agrega un nuevo servicio.

El `id` se genera automáticamente y no debe enviarse como parte de los datos del nuevo servicio.

```js
const newService = serviceManager.addService({
  name: "Mantenimiento preventivo",
  description: "Servicio de mantenimiento preventivo para equipos.",
  duration: 90,
  price: 20000,
  category: "Mantenimiento",
  available: true
});

console.log(newService);
```

El método valida que estén presentes los siguientes campos:

```text
name
description
duration
price
category
available
```

Los servicios incompletos son rechazados.

### `updateService(id, updatedData)`

Actualiza los datos de un servicio existente.

```js
const updatedService = serviceManager.updateService(4, {
  price: 22000,
  available: false
});

console.log(updatedService);
```

El `id` del servicio no puede ser modificado.

Si el servicio no existe, el método devuelve `null`.

### `deleteService(id)`

Elimina un servicio existente.

```js
const deletedService = serviceManager.deleteService(4);
console.log(deletedService);
```

Si el servicio no existe, el método devuelve `null`.

BookingManager

Ubicación:

src/managers/BookingManager.js

Métodos:

createBooking(bookingData)
getBookingById(id)
addServiceToBooking(bookingId, serviceId)

Los cambios se almacenan en bookings.json.

Persistencia

La aplicación utiliza el módulo fs de Node.js para leer y escribir los archivos JSON:

src/data/services.json
src/data/bookings.json

Los datos creados, modificados o eliminados se escriben en los archivos correspondientes, permitiendo conservar la información después de reiniciar el servidor.

## Scripts disponibles

### Iniciar la aplicación

```bash
npm start
```

### Modo desarrollo

```bash
npm run dev
```
## Producción
npm start
## Desarrollo
npm run dev

## Autor

Martin Gerardo Céspedes

## Licencia

ISC
