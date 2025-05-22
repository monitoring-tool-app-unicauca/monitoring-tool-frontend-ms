# Etapa 1: Build
FROM node:18-alpine as build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build -- --configuration production

# Etapa 2: Nginx
FROM nginx:alpine

# Copia build Angular a nginx
COPY --from=build-stage /app/dist/monitoring-tool/browser /usr/share/nginx/html

# Copia configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]