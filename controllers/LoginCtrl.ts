const util = require("../utils/packages");
import { Request, Response, NextFunction } from "express";
const { Op } = require("sequelize");
const db = require("../database/postgres");

const signTokens = (user: any, token: string) => {
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
  db.Oauth.create(decoded);
  return token;
};

module.exports = {
  login: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const loginSchema = util.Joi.object()
      .keys({
        email: util.Joi.string().required(),
        password: util.Joi.string().required(),
      })
      .unknown();

    const validate = loginSchema.validate(req.body);

    if (validate.error != null) {
      const errorMessage = validate.error.details
        .map((i: any) => i.message)
        .join(".");
      return res.status(400).json(util.helpers.sendError(errorMessage));
    }

    const { email, password } = req.body;

    let user = await db.Users.findOne({ where: { email } });

    if (!user) {
      return res
        .status(400)
        .json(util.helpers.sendError("Account does not exist"));
    }

    if (util.bcrypt.compareSync(password, user.password)) {
      if (user.locked === 1) {
        return res.status(400).json({
          status: "ERROR",
          code: "01",
          message: "Your account has been locked, kindly contact support",
        });
      }

      let random = util.uuid();

      const token = signTokens(user, random);

      // for company team members login verification

      return res.status(200).json({
        success: {
          token,
          message: "login successful",
        },
      });
    } else {
      return res.status(400).json({
        status: "ERROR",
        code: "01",
        message: "Incorrect email or password",
      });
    }
  },
};
