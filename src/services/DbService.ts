import { Injectable, Service } from "@tsed/common";
import { EmployeeModel } from "../models/EmployeeModel";
import fs from "fs-extra";

/**
 * Service which opens the json file and saves changes to it
 */
@Service()
export class DbService {
  private employees: EmployeeModel[] = [];

  /**
   * Load all json file contents into class variables on service init
   */
  constructor() {
    const data = fs.readFileSync("./src/data.json");
    this.employees.push(...JSON.parse(data));
  }

  /**
   * Return list of all employees
   * @returns Returns a EmployeeModel array
   */
  async getEmployees(): Promise<EmployeeModel[]> {
    return this.employees;
  }

  /**
   * Create a new employee and save to file
   * @param employee Employee model of new employee
   * @returns Returns a EmployeeModel array
   */
  async saveEmployee(employee: EmployeeModel): Promise<string> {
    const acc: number = this.employees.reduce(
      (acc: number, item: EmployeeModel) => {
        if (item.id > acc) acc = item.id;
        return acc;
      },
      0
    );
    employee.id = acc + 1;
    this.employees.push(employee);
    await fs.writeFile("./src/data.json", JSON.stringify(this.employees));
    return "Employee has been saved successfully";
  }

  /**
   * Update employee data on the list and save to file
   * @param id Id of employee to update
   * @param employee New EmployeeModel with changes to update
   * @returns Returns a EmployeeModel array or an error string if it doesnt find an employee with id
   */
  async updateEmployee(id: number, employee: EmployeeModel): Promise<string> {
    const index: number = this.employees.findIndex(item => item.id === id);
    if (index === -1) {
      return "No employee found with that id.";
    }
    employee.id = id;
    this.employees[index] = employee;
    await fs.writeFile("./src/data.json", JSON.stringify(this.employees));
    return "Employee has been update successfully";
  }

  /**
   * Delete an employee from the list and save to file
   * @param id Id of employee to delete
   * @returns Message of deletion success or failures
   */
  async deleteEmployee(id: number): Promise<string> {
    const employee: EmployeeModel | undefined = this.employees.find(
      (item: EmployeeModel) => item.id == id
    );
    if (employee === undefined) {
      return "No employee found with that id.";
    }
    this.employees = this.employees.filter((item: EmployeeModel) => {
      return item.id !== id;
    });
    await fs.writeFile("./src/data.json", JSON.stringify(this.employees));
    return `Employee ${employee.fullName} has been deleted from the system.`;
  }

  /**
   * Find an employe based on the emal and return it
   * Only being used at the moment for test clean up
   * @param email Employee email
   */
  async findEmployeeByEmail(email: string): Promise<EmployeeModel> {
    const employee: EmployeeModel = this.employees.find(
      employee => employee.email == email
    );
    return employee;
  }
}
