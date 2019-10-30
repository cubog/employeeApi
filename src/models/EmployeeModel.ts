import {
  Minimum,
  Maximum,
  Required,
  MaxLength,
  Email,
  UniqueItems,
  Property,
  IgnoreProperty
} from "@tsed/common";

export class EmployeeModel {
  id: number;

  @Required()
  @MaxLength(150)
  fullName: string;

  @Required()
  @Minimum(1)
  @Maximum(75)
  age: number;

  @Required()
  @MaxLength(3)
  cityCode: string;

  @MaxLength(150)
  @Email()
  email: string;

  @Required()
  @Minimum(100)
  @Maximum(10000)
  salary: number;
}