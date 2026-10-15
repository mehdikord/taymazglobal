import { defineConfig } from "prisma/config";

if (typeof process.loadEnvFile === "function") {
  process.loadEnvFile();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
