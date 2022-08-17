import request from "supertest";
import { PrismaClient, User } from "@prisma/client";
import { expect } from "chai";

import { app } from "src/app";
import { createToken } from "src/services/auth-service";

describe("Testing Jobs", () => {
  const jobs = new PrismaClient().job;
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

  describe("[GET] /jobs", () => {
    it("response findAll jobs", async () => {
      const jobData = await jobs.findMany();
      const response = await request(app())
        .get("/v1/jobs")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: jobData,
        message: "findJob",
      });
    });

    it("response wrong authentication error", async () => {
      await request(app()).get("/v1/jobs").expect(401);
    });
  });

  describe("[POST] /jobs", () => {
    it("response Create job", async () => {
      const jobData = {
        title: "Mac Company",
        description: "Company",
        company_scale: "giant",
        company_tips: "ACTIVELY HIRING, SAME INVESTOR AS META",
        job_info: "123",
      };

      const response = await request(app())
        .post("/v1/jobs")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(jobData)
        .expect(200);

      const realData = await jobs.findFirst({
        where: { title: "Mac Company" },
      });
      expect(response.body).to.deep.equal({
        data: realData,
        message: "createJob",
      });
    });

    it("response Create job", async () => {
      const jobData = {
        title: "Mac Company",
        description: "Company",
        company_scale: "giant",
        company_tips: "ACTIVELY HIRING, SAME INVESTOR AS META",
        job_info: "123",
      };

      await request(app())
        .post("/v1/jobs")
        .set("Authorization", `Bearer ${freelancerToken}`)
        .send(jobData)
        .expect(403);
    });
  });

  describe("[UPDATE] /jobs", () => {
    it("response Create job", async () => {
      const jobData = {
        title: "Mac Company",
        description: "Company",
        company_scale: "giant",
        company_tips: "ACTIVELY HIRING, SAME INVESTOR AS META",
        job_info: "123",
      };

      const response = await request(app())
        .put("/v1/jobs/1")
        .set("Authorization", `Bearer ${clientToken}`)
        .send(jobData)
        .expect(200);

      const realData = await jobs.findFirst({
        where: { title: "Mac Company" },
      });
      expect(response.body).to.deep.equal({
        data: realData,
        message: "updateJob",
      });
    });

    it("response Update job/:id", async () => {
      const jobData = {
        title: "Mac Company",
        description: "Company",
        company_scale: "giant",
        company_tips: "ACTIVELY HIRING, SAME INVESTOR AS META",
        job_info: "123",
      };

      await request(app())
        .post("/v1/jobs")
        .set("Authorization", `Bearer ${freelancerToken}`)
        .send(jobData)
        .expect(403);
    });
  });

  describe("[DELETE] /jobs/:id", () => {
    it("response Delete job", async () => {
      const jobData = await jobs.findUnique({
        where: { id: 1 },
      });

      const response = await request(app())
        .post("/v1/jobs/1")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);
    });
  });

  describe("[GET] /jobs/:id", () => {
    it("response Get job", async () => {
      const jobData = await jobs.findUnique({
        where: { id: 1 },
      });

      const response = await request(app())
        .get("/v1/jobs/1")
        .set("Authorization", `Bearer ${clientToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: jobData,
        message: "getjob",
      });
    });
  });
});
