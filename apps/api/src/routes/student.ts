import type { FastifyInstance } from "fastify";
import { getDashboardSummary, getStudentProfile, saveStudentProfile } from "../storage/student-store";
import { validateOnboardingInput } from "@sauce/validation";

export async function registerStudentRoutes(app: FastifyInstance) {
  app.get("/student/profile", async () => getStudentProfile());

  app.post("/student/profile", async (request, reply) => {
    try {
      const input = validateOnboardingInput(request.body);
      return saveStudentProfile(input);
    } catch (error) {
      return reply.status(400).send({
        error: error instanceof Error ? error.message : "Invalid student profile payload"
      });
    }
  });

  app.get("/student/dashboard", async () => getDashboardSummary());
}
