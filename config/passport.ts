const util = require("../utils/packages");

const JWTStrategy = util.passportJWT.Strategy;
var ExtractJWT = util.passportJWT.ExtractJwt;
var opts: any = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

var LocalStrategy = require("passport-local").Strategy;
const db = require("../database/postgres");

util.passport.use(
  new JWTStrategy(opts, async (jwt_payload: any, done: any) => {
    var checkToken = await db.Oauth.findOne({
      where: {
        email: jwt_payload.email,
        iat: jwt_payload.iat,
        exp: jwt_payload.exp,
      },
    });

    if (!checkToken) {
      return done({ message: "Unathorized" });
    }

    await db.Users.findOne({ where: { id: jwt_payload.id } })
      .then((user: any) => {
        if (!user) {
          return done({ message: "Unathorized" });
        }
        return done(null, user);
      })
      .catch((error: any) => {
        return done({ message: "Unathorized" });
      });
  })
);
