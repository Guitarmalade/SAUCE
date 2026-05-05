import type { FastifyInstance } from "fastify";
import { addPracticeLog, listPracticeLogs } from "../storage/student-store";
import { validatePracticeLogInput } from "@sauce/validation";

export async function registerPracticeRoutes(app: FastifyInstance) {
  app.get("/practice/logs", async () => listPracticeLogs());

  app.post("/practice/logs", async (request, reply) => {
    try {
      const input = validatePracticeLogInput(request.body);
      return addPracticeLog(input);
    } catch (error) {
      return reply.status(400).send({
        error: error instanceof Error ? error.message : "Invalid practice log payload"
      });
    }
  });
}
