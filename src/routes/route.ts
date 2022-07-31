import { Router, Express } from "express";

import { config } from "src/config";

import rootRoutes from "src/routes/root";
import userRoutes from "./users";
import authRoutes from "./auth";
import jobsRoutes from "./jobs";
import applicationsRoutes from "./applications";

export default (app: Express): void => {
  app.use(rootRoutes);

  const api = Router();
  api.use("/users", userRoutes);
  api.use("/jobs", jobsRoutes);
  api.use("/auth", authRoutes);
  api.use("/applications", applicationsRoutes);

  app.use(config.apiPrefix, api);
};
