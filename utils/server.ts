const packages = require("./packages");
require("dotenv").config();
function createServer() {
  const app = packages.express();
  app.set("trust proxy", true);

  // cross origin middleware
  app.use(packages.cors());

  // set security HTTP headers
  app.use(packages.helmet());

  // const apiLimiter = packages.rateLimit({
  //   windowMs: 1000, // 15 minutes
  //   max: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  //   message: "Api call error, too many requests",
  //   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  //   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // });

  // app.use(apiLimiter);

  // session
  app.use(packages.cookieParser());
  app.use(packages.compression());
  app.use(packages.express.json());
  app.use(
    packages.session({
      secret: process.env.SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: { maxAge: 600000 },
    })
  );

  app.use(packages.bodyParser.urlencoded({ extended: true }));
  app.use(packages.bodyParser.json());

  app.use("/api/v1/test/public/", packages.publicRoute);
  app.use("/api/v1/test/auth/", packages.blogRoute);

  app.use(packages.passport.initialize());

  app.use((req: any, res: any, next: any) => {
    res.header("Acces-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apiKey"
    );

    if (req.method == "OPTIONS") {
      req.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, DELETE, PATCH, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  app.use((error: any, req: any, res: any, next: any) => {
    if (error.message == "Unathorized from server") {
      return res
        .status(401)
        .json(packages.helpers.sendError("Email does not exist"));
    }

    res.status(error.status || 500);
    res.json({
      error: {
        status: "ERROR",
        message: error.message,
      },
    });
  });

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    let errCode, errMessage;

    if (err.errors) {
      errCode = 400;
      const keys = Object.keys(err.errors);
      errMessage = err.errors[keys[0]].message;
    } else {
      errCode = err.status || 500;
      errMessage = err.message || "Internal Server Error";
    }

    res.status(errCode).type("txt").send(errMessage);
  });

  // Landing page
  app.use("/", (req: any, res: any, next: any) => {
    res.status(200).json({ success: true });
  });

  return app;
}

module.exports = { createServer };
