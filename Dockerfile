
FROM node:14

# Establecer directorio de trabajo
WORKDIR /index.js

# Copiar archivos de aplicación al contenedor
COPY package.json .
COPY package-lock.json .
COPY . .

# Instalar dependencias
RUN npm install

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "index.js" ]
