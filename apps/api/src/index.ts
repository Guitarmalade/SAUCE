import Fastify from "fastify";
import { registerCurriculumRoutes } from "./routes/curriculum";
import { registerHealthRoute } from "./routes/health";
import { registerPracticeRoutes } from "./routes/practice";
import { registerStudentRoutes } from "./routes/student";

const app = Fastify({ logger: true });

await registerHealthRoute(app);
await registerCurriculumRoutes(app);
await registerStudentRoutes(app);
await registerPracticeRoutes(app);

const port = Number(process.env.API_PORT ?? 4000);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => {
    app.log.info(`SAUCE API listening on ${port}`);
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
