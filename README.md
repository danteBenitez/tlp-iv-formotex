# Trabajo Práctico: Desarrollo con TypeScript

## Sobre el proyecto

El presente proyecto es una aplicación de gestión de inventario de equipos informáticos destinada a la empresa ficticia _Formotex_, que se encarga del mantenimiento y distribución de equipos informáticos. La aplicación ofrece las siguientes funcionalidades:

- **Registro de usuarios y asignación de roles**: Al crearse, la aplicación crea un usuario administrador básico (credenciales `admin` y `admin`) y este usuario es capaz de crear y asignar roles a otros usuarios. Concretamente, puede:
  - Crear usuarios con correo electrónico, usuario y contraseña.
  - Asignar roles a los usuarios creados (administrador, o empleado).
  - Modificar sus datos personales
- **Gestión de tipos de equipo**: Los tipos de equipo son categorías de equipos informáticos que pueden ser asignados a los equipos como tales. El empleado puede:
  - Crear tipos de equipo con un nombre y una descripción.
  - Modificar los datos de los tipos de equipo.
  - Eliminar tipos de equipo.
- **Gestión de marcas**: La gestión de las marcas de equipamientos reconocidas por Formotex. Un empleado puede:
  - Crear marcas con un nombre y una descripción.
  - Modificar los datos de las marcas.
  - Eliminar marcas.
- **Gestión de equipamientos**: El equipamiento informático como tal puede ser creado, actualizado y eliminado. Cada equipamiento da lugar a la creación de "unidades" o ejemplos concretos de este equipamiento, con datos únicos como el número de serie. Un empleado puede:
  - Crear equipamientos con un tipo de equipo, un nombre, una descripción y una marca.
  - Modificar los datos de los equipamientos.
  - Eliminar equipamientos.
  - Crear unidades de equipamiento a partir de un equipamiento.
  - Modificar los datos de las unidades de equipamiento.
  - Eliminar unidades de equipamiento.
- **Gestión de organizaciones**: Cada unidad de Formotex se asigna a una organización que es su cliente y a la que corresponde el equipo informático. Un administrador puede:
  - Crear organizaciones con un nombre y una descripción.
  - Modificar los datos de las organizaciones.
  - Eliminar organizaciones.
- **Actividad del inventario**: La aplicación permite registrar acciones de distintos tipos que se realizan con los equipos. Hasta el momento soporta:
  - Ingreso: Se registra el ingreso de una nueva unidad de equipamiento a la empresa, con una fecha de ingreso.
  - Mantenimiento: Se registra manntenimiento preventivo o correctivo de un equipo, con una fecha de inicio y una fecha de fin.
  - Entrega: Entrega de la unidad a la organización a la que está asociada.

## Instrucciones de ejecución del proyecto

1. Clonar el repositorio

```bash
git clone https://github.com/danteBenitez/tlp-iv-formotex
```

2. Instalar las dependencias

```bash
npm install
```

3. Crear un archivo `.env.prod` o `.env.dev` en el directorio raíz del proyecto con la siguiente forma:

```bash
DB_DIALECT=         # Dialecto de la base de datos (Vea https://sequelize.org/docs/v6/getting-started/ por los valores soportados)
DB_HOST=            # Host de la base de datos
DB_PORT=            # Puerto de la base de datos
DB_USER=            # Usuario de la base de datos
DB_PASSWORD=        # Contraseña del usuario
DB_NAME=            # Nombre de la base de datos
PORT=               # Puerto de la aplicación
SALT_ROUNDS=        # Número de rondas a usar para la encriptación de las contraseñas
JWT_SECRET=         # Secreto para cifrar JWTs
```

Asegúrese de que exista un servidor de base de datos con los datos especificados en el archivo `.env.prod` o `.env.dev`.

4. a. Sincronización de la base de datos

El repositorio incluye un script de sincronización de la base de datos. Para ejecutarlo, ejecute el siguiente comando:

```bash
# Si desea utilizar las variables de entorno de producción
npm run database:sync-prod
# Si desea utilizar las variables de entorno de desarrollo
npm run database:sync
```

Nótese que la sincronización puede eliminar los datos existentes en la base de datos.

5. Ejecutar el proyecto en modo de desarrollo:

```bash
npm run dev
```

o, en modo producción:

```bash
npm run start
```

La ejecución en modo de producción leerá el archivo `.env.prod`, mientras que la ejecución en modo de desarrollo leerá el archivo `.env.dev`.
