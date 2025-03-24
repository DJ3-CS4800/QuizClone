FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .

COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8081

ENTRYPOINT ["nginx", "-g", "daemon off;"]
