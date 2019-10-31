import {
  GlobalAcceptMimesMiddleware,
  ServerLoader,
  ServerSettings
} from "@tsed/common";
import "@tsed/ajv";
import "@tsed/swagger";
var cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const rootDir = __dirname;

@ServerSettings({
  rootDir,
  acceptMimes: ["application/json"],
  mount: {
    "/api": "${rootDir}/controllers/**/*.ts"
  },
  swagger: [
    {
      path: "/api-docs"
    }
  ],
  ajv: {
    errorFormat: error =>
      `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
    options: { verbose: true }
  },
  componentsScan: [`${rootDir}/services/**/**.js`]
})
export class Server extends ServerLoader {
  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  public $beforeRoutesInit(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(cors())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
