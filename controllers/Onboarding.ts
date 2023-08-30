require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const util = require("../utils/packages");
const db = require("../database/postgres");

const signToken = (user: any, token: string) => {
  var token: string = util.jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      conpany_name: user.conpany_name,
      phone_number: user.phone_number,
      otp: user.otp,
    },
    process.env.SECRET,
    {
      expiresIn: 1800,
    }
  );
  var decoded = util.jwt_decode(token);
  db.dbs.Oauth.create(decoded);
  return token;
};

// interface TypedRequestBody<T> extends Express.Request {
//   body: T;
// }

// export interface TypedRequestBody<T extends Query, U> extends Express.Request {
//   body: U;
//   query: T;
// }

// interface TypedResponse<ResBody> extends Express.Response {
//   json: Send<ResBody, this>;
// }

module.exports = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    const schema = util.Joi.object()
      .keys({
        email: util.Joi.string().required(),
        mobile: util.Joi.string().required(),
        password: util.Joi.string().required(),
      })
      .unknown();

    const validate = schema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(util.helpers.sendError(errorMessage));
    }

    let checkMail = await util.helpers.checkMail(req);
    let checkMobile = await util.helpers.checkMobile(req);

    if (checkMail) {
      return res
        .status(400)
        .json(util.helpers.sendError("User with email already exists"));
    }

    if (checkMobile) {
      return res
        .status(400)
        .json(util.helpers.sendError("User with mobile number already exists"));
    }

    const { email, password, mobile } = req.body;

    if (!email.includes("@")) {
      return res
        .status(400)
        .json(util.helpers.sendError("Kindly enter a valid email address"));
    }

    if (/[a-zA-Z]/.test(mobile)) {
      return res
        .status(400)
        .json(util.helpers.sendError("Kindly enter a valid mobile number"));
    }

    const createUser = await db.Users.create({
      uuid: util.uuid(),
      mobile_number: mobile,
      status: "Active",
      password: util.bcrypt.hashSync(password),
      email,
    });

    return res.status(200).json({
      success: {
        status: "SUCCESS",
        message: `Registration successful`,
      },
    });
  },
};
