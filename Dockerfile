FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .
RUN npm run build
RUN npx tsc --esModuleInterop prisma/seed.ts

FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["npm", "run", "start:prod"]