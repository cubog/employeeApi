import { inject, TestContext } from "@tsed/testing";
import jest from "jest";
import { DbService } from "../../src/services/DbService";
import { EmployeeModel } from "../../src/models/EmployeeModel";

describe("DbService", () => {
  afterEach(TestContext.reset);

  test("Should receive all employees", inject(
    [DbService],
    async (dbService: DbService) => {
      let result: EmployeeModel[] = await dbService.getEmployees();
      expect(result.length).toBeGreaterThan(1);
    }
  ));

  test("Add a new employee", inject(
    [DbService],
    async (dbService: DbService) => {
      const email = "doug@r.com";
      const result: string = await dbService.saveEmployee({
        fullName: "Jorge Lopez",
        age: 47,
        cityCode: "HAB",
        email: email,
        salary: 10000,
        id: null
      });

      expect(result).toBe("Employee has been saved successfully");

      // Test clean up deleting the employee created
      const employee: EmployeeModel = await dbService.findEmployeeByEmail(
        email
      );
      await dbService.deleteEmployee(employee.id);
    }
  ));

  test("Delete an employee", inject(
    [DbService],
    async (dbService: DbService) => {
      // Test setup up creating new patient to be deleted
      const email = "juan@r.com";
      await dbService.saveEmployee({
        fullName: "Mario Lopez",
        age: 47,
        cityCode: "CUB",
        email: email,
        salary: 10000,
        id: null
      });

      // Actual test run
      const employee: EmployeeModel = await dbService.findEmployeeByEmail(
        email
      );
      const result = await dbService.deleteEmployee(employee.id);
      expect(result).toBe(
        "Employee Mario Lopez has been deleted from the system."
      );
    }
  ));

  test("Try to delete an employee with invalid id we get error", inject(
    [DbService],
    async (dbService: DbService) => {
      let result: string = await dbService.deleteEmployee(100000);
      expect(result).toBe("No employee found with that id.");
    }
  ));

  test("Update a patient and verify changes", inject(
    [DbService],
    async (dbService: DbService) => {
      // Creating a new employee to be able to modify it
      const email = "josh@r.com";
      const firstName = "Josh Josh";
      const secondName = "Mario Mario";
      let employeeSchema = {
        fullName: firstName,
        age: 47,
        cityCode: "MIA",
        email: email,
        salary: 500,
        id: null
      };
      await dbService.saveEmployee(employeeSchema);
      // Find employee to update
      let employee: EmployeeModel = await dbService.findEmployeeByEmail(email);
      // Test begins
      employeeSchema["fullName"] = secondName;
      const updateResult = await dbService.updateEmployee(
        employee.id,
        employeeSchema
      );

      expect(updateResult).toBe("Employee has been update successfully");

      let updatedEmployee: EmployeeModel = await dbService.findEmployeeByEmail(
        email
      );

      expect(updatedEmployee.fullName).toBe(secondName);
      expect(updatedEmployee.fullName).not.toBe(firstName);
      await dbService.deleteEmployee(updatedEmployee.id);
    }
  ));
});
