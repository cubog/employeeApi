import {
  GlobalAcceptMimesMiddleware,
  ServerLoader,
  ServerSettings
} from "@tsed/common";
import "@tsed/ajv";
import "@tsed/swagger";
var cors = require("cors");
import { RequestSessionMiddleware } from "./middlewares/RequestSessionMiddleware";

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const session = require("express-session");
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
  componentsScan: [
    `${rootDir}/services/**/**.js`,
    `${rootDir}/middlewares/**/**.ts`
  ]
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
      .use(cors({ credentials: true, origin: "http://localhost:3000" }))
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(
        session({
          secret: "employees",
          resave: false,
          saveUninitialized: true,
          cookie: {
            secure: false // set true if HTTPS is enabled
          }
        })
      )
      .use(RequestSessionMiddleware);
  }
}
