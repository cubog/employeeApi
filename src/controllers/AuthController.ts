import {
  BodyParams,
  Controller,
  Get,
  Post,
  Session,
  Status
} from "@tsed/common";
import session = require("express-session");
import { Unauthorized } from "ts-httpexceptions";

@Controller("/")
export class RestCtrl {
  @Post("/login")
  @Status(204)
  login(
    @BodyParams("username") username: string,
    @BodyParams("password") password: string,
    @Session("user") user: any
  ) {
    if (username === "username" && password === "password") {
      user.auth = true;
      user.name = username;
    } else {
      throw new Unauthorized("Unauthorized");
    }
  }

  @Post("/logout")
  logout(@Session("user") user: any) {
    user.auth = null;
    delete user.name;
  }
}
