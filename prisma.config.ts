// Prisma 7 configuration for Brewclaw
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DATABASE_URL from .env for migrations
    // For local dev: postgresql://postgres:postgres@localhost:51214/postgres
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/brewclaw",
  },
});
