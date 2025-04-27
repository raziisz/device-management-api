FROM node:22.15-slim AS builder

RUN apt update && \
    apt install openssl procps -y && \
    npm install -g @nestjs/cli@10.4.9

WORKDIR /app
ENV TZ=America/Manaus
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json .
RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run prisma:migrate:deploy
RUN npm run build

FROM node:22.15-slim AS runner

WORKDIR /app
ENV TZ=America/Manaus
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=builder /app .


EXPOSE 3000

CMD ["node", "dist/src/main.js"]
