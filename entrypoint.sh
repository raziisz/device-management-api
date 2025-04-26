#!/bin/sh

echo "⏳ Esperando o banco de dados iniciar em db:3306..."
until nc -z db 3306; do
  sleep 1
done

echo "✅ Banco de dados disponível. Rodando as migrações Prisma..."
npx prisma migrate deploy --schema=src/shared/infrastructure/database/prisma/schema.prisma

echo "🚀 Iniciando a aplicação..."
exec node dist/src/main.js
