import request from "supertest";
import { PrismaClient, User } from "@prisma/client";
import { expect } from "chai";

import { app } from "src/app";
import { createToken } from "src/services/auth-service";

describe("Testing applications", () => {
  const applications = new PrismaClient().application;
  const users = new PrismaClient().user;
  let adminUser: User | null,
    clientUser: User | null,
    freelancerUser: User | null;
  let adminToken: string, clientToken: string, freelancerToken: string;

  before(async () => {
    adminUser = await users.findFirst({ where: { role: "admin" } });
    clientUser = await users.findFirst({ where: { role: "client" } });
    freelancerUser = await users.findFirst({ where: { role: "freelancer" } });
    adminToken = adminUser ? createToken(adminUser).token : "";
    clientToken = clientUser ? createToken(clientUser).token : "";
    freelancerToken = freelancerUser ? createToken(freelancerUser).token : "";
  });

  describe("[GET] /applications", () => {
    it("response findAll applications", async () => {
      const applicationData = await applications.findMany();
      const response = await request(app())
        .get("/v1/applications")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: applicationData,
        message: "findApplication",
      });
    });

    it("response wrong authentication error", async () => {
      await request(app()).get("/v1/applications").expect(401);
    });
  });

  describe("[POST] /applications", () => {
    it("response Create application", async () => {
      const applicationData = {
        rate: 5000,
        content: "Company",
      };

      const response = await request(app())
        .post("/v1/applications")
        .set("Authorization", `Bearer ${freelancerToken}`)
        .send(applicationData)
        .expect(200);

      const realData = await applications.findFirst({
        where: { content: "Company", rate: 5000 },
      });
      expect(response.body).to.deep.equal({
        data: realData,
        message: "createapplication",
      });
    });

    it("response Create application", async () => {
      const applicationData = {
        title: "Mac Company",
        description: "Company",
        company_scale: "giant",
        company_tips: "ACTIVELY HIRING, SAME INVESTOR AS META",
        application_info: "123",
      };

      await request(app())
        .post("/v1/applications")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(applicationData)
        .expect(403);
    });
  });

  describe("[UPDATE] /applications", () => {
    it("response Create application", async () => {
      const applicationData = {
        context: "Mac Company",
        rate: 10000,
      };

      const response = await request(app())
        .put("/v1/applications/1")
        .set("Authorization", `Bearer ${freelancerToken}`)
        .send(applicationData)
        .expect(200);

      const realData = await applications.findFirst({
        where: { content: "Mac Company" },
      });
      expect(response.body).to.deep.equal({
        data: realData,
        message: "updateapplication",
      });
    });

    it("response Update application/:id", async () => {
      const applicationData = {
        context: "Mac Company",
        rate: 10000,
      };

      await request(app())
        .post("/v1/applications")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(applicationData)
        .expect(403);
    });
  });

  describe("[GET] /applications/:id", () => {
    it("response Get application", async () => {
      const applicationData = await applications.findUnique({
        where: { id: 1 },
      });

      const response = await request(app())
        .get("/v1/applications/1")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: applicationData,
        message: "getApplication",
      });
    });
  });
});
