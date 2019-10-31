import {
  BodyParams,
  PathParams,
  QueryParams,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseBefore,
  Required
} from "@tsed/common";
import { EmployeeModel } from "../models/EmployeeModel";
import { CustomMiddleware } from "../middlewares/CustomMiddleware";
import { DbService } from "../services/DbService";

/**
 * Employess controller
 */
@Controller("/employees")
export class EmployeeCtrl {
  constructor(private dbService: DbService) {}

  @Get()
  getAll(): Promise<EmployeeModel[]> {
    return this.dbService.getEmployees();
  }

  @Post()
  @UseBefore(CustomMiddleware)
  createEmployee(
    @BodyParams(EmployeeModel) model: EmployeeModel
  ): Promise<string> {
    return this.dbService.saveEmployee(model);
  }

  @Put("/:id")
  updateEmployee(
    @PathParams("id") @Required() id: number,
    @BodyParams(EmployeeModel) model: EmployeeModel
  ): Promise<string> {
    return this.dbService.updateEmployee(id, model);
  }

  @Delete()
  deleteEmployee(@QueryParams("id") id: number): Promise<string> {
    return this.dbService.deleteEmployee(id);
  }
}
