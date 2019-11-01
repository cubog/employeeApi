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
  Required,
  Session
} from "@tsed/common";
import { EmployeeModel } from "../models/EmployeeModel";
import { RequestSessionMiddleware } from "../middlewares/RequestSessionMiddleware";
import { DbService } from "../services/DbService";
import { Unauthorized } from "ts-httpexceptions";

/**
 * Employess controller
 */
@Controller("/employees")
export class EmployeeCtrl {
  constructor(private dbService: DbService) {}

  @Get()
  getAll(@Session("user") user: any): Promise<EmployeeModel[]> {
    if (user.auth) {
      return this.dbService.getEmployees();
    } else {
      throw new Unauthorized("Unauthorized");
    }
  }

  @Post()
  createEmployee(
    @Session("user") user: any,
    @BodyParams(EmployeeModel) model: EmployeeModel
  ): Promise<string> {
    if (user.auth) {
      return this.dbService.saveEmployee(model);
    } else {
      throw new Unauthorized("Unauthorized");
    }
  }

  @Put("/:id")
  updateEmployee(
    @Session("user") user: any,
    @PathParams("id") @Required() id: number,
    @BodyParams(EmployeeModel) model: EmployeeModel
  ): Promise<string> {
    if (user.auth) {
      return this.dbService.updateEmployee(id, model);
    } else {
      throw new Unauthorized("Unauthorized");
    }
  }

  @Delete()
  deleteEmployee(
    @Session("user") user: any,
    @QueryParams("id") id: number
  ): Promise<string> {
    if (user.auth) {
      return this.dbService.deleteEmployee(id);
    } else {
      throw new Unauthorized("Unauthorized");
    }
  }
}
