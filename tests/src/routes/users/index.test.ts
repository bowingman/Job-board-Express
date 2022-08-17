import request from "supertest";
import bcrypt from "bcrypt";
import { jest } from "@jest/globals";
import { app } from "src/app";
import { User, PrismaClient } from "@prisma/client";
import { expect } from "chai";
import { createToken } from "src/services/auth-service";

describe("Testing Users", () => {
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

  describe("[GET] /users", () => {
    it("response findAll users", async () => {
      const userData = await users.findMany();
      const response = await request(app())
        .get("/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: userData,
        message: "findUser",
      });
    });

    it("response wrong authentication error", async () => {
      await request(app()).get("/v1/users").expect(401);
    });
  });

  describe("[POST] /users", () => {
    it("response Create user", async () => {
      const userData = {
        name: "Stephen",
        password: "123456",
        title: "Frontend Developer",
        role: "freelancer",
        description: "seeking a frontend devlopment",
      };

      const response = await request(app())
        .post("/v1/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(userData)
        .expect(200);

      const realData = await users.findUnique({
        where: { name: "Stephen" },
      });
      expect(response.body).to.deep.equal({
        data: realData,
        message: "createUser",
      });
    });
  });
  describe("[GET] /user/1", () => {
    it("response Get user", async () => {
      const userData = await users.findUnique({
        where: { id: 1 },
      });

      const response = await request(app())
        .post("v1/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).to.deep.equal({
        data: userData,
        message: "findUser",
      });
    });
  });
  describe("[DELETE] /user/1", () => {
    it("response Delete user", async () => {
      const userData = await users.findUnique({
        where: { id: 1 },
      });

      const response = await request(app())
        .delete("v1/users/1")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
    });
    describe("[UPDATE] /user/1", () => {
      it("response Get user", async () => {
        const userData = {
          name: "Stephen",
          password: "123456",
          title: "Frontend Developer",
          role: "freelancer",
          description: "seeking a frontend devlopment",
        };

        const response = await request(app())
          .put("v1/users/1")
          .set("Authorization", `Bearer ${adminToken}`)
          .send(userData)
          .expect(200);

        const realData = await users.findUnique({
          where: { id: 1 },
        });

        expect(response.body).to.deep.equal({
          data: realData,
          message: "findUser",
        });
      });
    });
  });
});

// import { expect } from "chai";
// import supertest from "supertest";
// import * as userService from "src/services/user-service";

// import { app } from "src/app";

// describe("Users", () => {
//   beforeEach(() => {
//     userService.users.splice(0, userService.users.length);
//   });

//   context("given no users in the database", () => {
//     context("when POST /v1/users is made", () => {
//       const username = `random${Math.random()}`;

//       let response: supertest.Response;
//       before(async () => {
//         response = await supertest(app())
//           .post("/v1/users")
//           .send({ username })
//           .expect(200);
//       });

//       it("should respond with created user object", () => {
//         expect(response.body).to.have.property("id", "1");
//         expect(response.body).to.have.property("username", username);
//       });
//     });

//     context("given some users are in the db", () => {
//       const users = [
//         { id: "1", username: "abc" },
//         { id: "2", username: "xyz" },
//       ];

//       beforeEach(() => {
//         userService.users.push(...users);
//       });

//       context("when GET /v1/users is received", () => {
//         let response: supertest.Response;
//         beforeEach(async () => {
//           response = await supertest(app()).get("/v1/users").expect(200);
//         });
//         it("should respond with all users", () => {
//           expect(response.body).to.deep.equal(users);
//         });
//       });
//     });
//   });
// });
