import { EmployeeModel } from "../models/EmployeeModel";

const fs = require("fs-extra");

export async function getEmployees() {
  const data = await fs.readFileSync("./src/data.json");
  const content = JSON.parse(data);
  return content;
}

export async function saveEmployee(employee: EmployeeModel) {
  const data = await fs.readFile("./src/data.json");
  const content = JSON.parse(data);
  let acc = await content.reduce((acc: number, item: EmployeeModel) => {
    if (item.id > acc) acc = item.id;
    return acc;
  }, 0);
  employee.id = acc + 1;
  content.push(employee);
  await fs.writeFile("./src/data.json", JSON.stringify(content));
  return content;
}

export async function updateEmployee(employee: EmployeeModel) {
  const data = await fs.readFile("./src/data.json");
  const content = JSON.parse(data).map((item: EmployeeModel) => {
    return item.id === employee.id ? employee : item;
  });
  await fs.writeFile("./src/data.json", JSON.stringify(content));
  return content;
}

export async function deleteEmployee(employee: EmployeeModel) {
  const data = await fs.readFile("./src/data.json");
  const content = JSON.parse(data).filter((item: EmployeeModel) => {
    return item.id !== employee.id;
  });
  await fs.writeFile("./src/data.json", JSON.stringify(content));
  return content;
}
