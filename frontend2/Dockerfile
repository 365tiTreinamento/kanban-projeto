# syntax=docker/dockerfile:1
FROM node:20-slim as build
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm i --silent --no-progress || true
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV VITE_API_BASE=http://localhost:8080/api
COPY --from=build /app/dist ./dist
RUN npm i -g serve
EXPOSE 5173
CMD ["serve","-s","dist","-l","5173"]
