import type { FastifyInstance } from "fastify";
import { CORE_AREAS, LEVELS, LEVEL_ONE_EXERCISES, listExercisesForLevel } from "@sauce/curriculum";

export async function registerCurriculumRoutes(app: FastifyInstance) {
  app.get("/curriculum/areas", async () => CORE_AREAS);
  app.get("/curriculum/levels", async () => LEVELS);
  app.get("/curriculum/roadmap", async () => ({
    areas: CORE_AREAS,
    levels: LEVELS,
    levelOneExercises: LEVEL_ONE_EXERCISES
  }));
  app.get("/curriculum/levels/:level/exercises", async (request) => {
    const level = Number((request.params as { level: string }).level);
    return listExercisesForLevel(level);
  });
}
