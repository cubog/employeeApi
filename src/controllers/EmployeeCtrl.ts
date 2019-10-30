import {
  BodyParams,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseBefore
} from "@tsed/common";
import { EmployeeModel } from "../models/EmployeeModel";
import {
  getEmployees,
  saveEmployee,
  updateEmployee
} from "../services/DbServices";
import { CustomMiddleware } from "../middlewares/CustomMiddleware";

@Controller("/employees")
export class EmployeeCtrl {
  @Get()
  async getAll(): Promise<any> {
    return getEmployees();
  }

  @Post()
  @UseBefore(CustomMiddleware)
  async createEmployee(@BodyParams() model: EmployeeModel): Promise<any> {
    return saveEmployee(model);
  }

  @Put()
  async updateEmployee(@BodyParams() model: EmployeeModel) {
    // await updateEmployee();
    return "employee updated";
  }

  @Delete()
  deleteEmployee() {
    return "employee deleted";
  }
}
