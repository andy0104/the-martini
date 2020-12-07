# FROM node:alpine

# WORKDIR /app/backend

# COPY ./package.json ./

# RUN npm install

# COPY ./ ./

# EXPOSE 5000

# CMD ["npm", "run", "prod"]

## FROM node:alpine as builder
FROM node:alpine
WORKDIR /app/backend
COPY ./package*.json ./
RUN npm install
COPY . .
RUN npm run clean
RUN npm run build

FROM nginx
EXPOSE 5000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/backend/build /usr/share/nginx/html