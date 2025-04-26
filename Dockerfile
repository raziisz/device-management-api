FROM node:22.15-slim AS builder

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

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
RUN npm run build

FROM node:22.15-slim AS runner

WORKDIR /app
ENV TZ=America/Manaus
RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y netcat-openbsd
COPY --from=builder /app .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
