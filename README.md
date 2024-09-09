# Trabajo Práctico: Desarrollo con TypeScript

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
