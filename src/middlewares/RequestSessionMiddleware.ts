import { Middleware, Req } from "@tsed/common";
import { Unauthorized } from "ts-httpexceptions";

@Middleware()
export class RequestSessionMiddleware {
  use(@Req() request: Req) {
    if (request.session) {
      request.session.user = request.session.user || {
        auth: null
      };
    }
  }
}
