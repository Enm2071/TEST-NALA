# Etapa 1: Compilación del código TypeScript
FROM node:20.11.1 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición y configuración
COPY package*.json tsconfig.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY ./ ./

# Compila el proyecto
RUN npm run build

# Etapa 2: Imagen de producción
FROM node:20.11.1

WORKDIR /app

# Copia los archivos necesarios de la etapa de compilación
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --production

EXPOSE 3000

# Inicia la aplicación compilada
CMD ["node", "dist/server.js"]
