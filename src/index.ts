import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import { connect, close } from "./utils/db";

import taskRoutes from "./routes/task.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import { APPLICATION_PORT } from "./utils/util";

if (!APPLICATION_PORT) {
  throw new Error("Please expose PORT to env.");
}

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(compression());
  app.use(morgan("tiny"));

  app.use("/api", taskRoutes);
  app.use("/api", authRoutes);
  app.use("/api", userRoutes);

  await connect();

  const server = app.listen(APPLICATION_PORT, () =>
    console.log(`Server running on port ${APPLICATION_PORT}`)
  );

  const shutdown = async () => {
    console.log("Closing HTTP server.");
    server.close(async () => {
      await close();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
