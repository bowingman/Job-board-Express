import { Router, Express } from "express";

import { config } from "src/config";

import rootRoutes from "src/routes/root";
import userRoutes from "./users";
import authRoutes from "./auth";

export default (app: Express): void => {
  app.use(rootRoutes);

  const api = Router();
  api.use("/users", userRoutes);
  api.use("/auth", authRoutes);

  app.use(config.apiPrefix, api);
};
