import "jest";
import { inject, bootstrap, TestContext } from "@tsed/testing";
import { ExpressApplication } from "@tsed/common";
import SuperTest from "supertest";
import { Server } from "../../src/server";
import { DbService } from "../../src/services/DbService";
import { EmployeeModel } from "../../src/models/EmployeeModel";

describe("EmployeeCtrl", () => {
  // bootstrap your Server to load all endpoints before run your test
  let app;
  let dbService: DbService;

  beforeEach(bootstrap(Server));
  beforeEach(inject(
    [ExpressApplication],
    (expressApplication: ExpressApplication) => {
      app = SuperTest.agent(expressApplication);
    }
  ));
  beforeEach(inject([DbService], (service: DbService) => {
    dbService = service;
  }));
  afterEach(TestContext.reset);

  test("Get all employees endpoint", async () => {
    // login the user in to be able to hit authenticated endpoint
    await app
      .post("/api/login")
      .send({ username: "username", password: "password" });
    // actual test
    const response = await app.get("/api/employees");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  test("Create a new employee endpoint", async () => {
    // login the user in to be able to hit authenticated endpoint
    await app
      .post("/api/login")
      .send({ username: "username", password: "password" });
    // actual test
    const email = "juan@r3.com";
    const response = await app.post("/api/employees").send({
      fullName: "Juan Ketchup",
      age: 10,
      cityCode: "NYC",
      email: email,
      salary: 100
    });
    expect(response.status).toBe(200);
    //clean up of test data
    const employeeCreated: EmployeeModel = await dbService.findEmployeeByEmail(
      email
    );
    dbService.deleteEmployee(employeeCreated.id);
  });
});
