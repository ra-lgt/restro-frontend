# path: ./Dockerfile.prod

FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM node:16-alpine as release
WORKDIR /app
COPY --from=build /app/ ./
CMD ["npm", "start"]
