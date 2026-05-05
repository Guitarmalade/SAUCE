export * from "./client";
export * from "./repository";

export const databasePackage = {
  provider: "postgresql",
  schemaPath: "packages/database/prisma/schema.prisma"
};
