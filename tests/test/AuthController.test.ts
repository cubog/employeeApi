import "jest";
import { inject, bootstrap, TestContext } from "@tsed/testing";
import { ExpressApplication } from "@tsed/common";
import SuperTest from "supertest";
import { Server } from "../../src/server";
import { DbService } from "../../src/services/DbService";

describe("AuthCtrl", () => {
  // bootstrap your Server to load all endpoints before run your test
  let app;
  let dbService: DbService;

  beforeEach(bootstrap(Server));
  beforeEach(inject(
    [ExpressApplication],
    (expressApplication: ExpressApplication) => {
      app = SuperTest(expressApplication);
    }
  ));
  beforeEach(inject([DbService], (service: DbService) => {
    dbService = service;
  }));
  afterEach(TestContext.reset);

  test("Log in to user endpoint", async () => {
    const res = await app
      .post("/api/login")
      .send({ username: "username", password: "password" });
    expect(res.status).toBe(204);
  });

  test("User enteres wrong password", async () => {
    const res = await app
      .post("/api/login")
      .send({ username: "username", password: "" });
    expect(res.status).toBe(401);
  });

  test("User logs out of the app", async () => {
    const res = await app.post("/api/logout");
    expect(res.status).toBe(200);
  });
});
