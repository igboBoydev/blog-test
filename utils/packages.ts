// database
exports.dbs = require("../database/postgres");

// libraries/packages
exports.express = require("express");
exports.session = require("express-session");
exports.helpers = require("../config/helpers");
exports.cors = require("cors");
exports.cookieParser = require("cookie-parser");
exports.bodyParser = require("body-parser");
exports.passport = require("passport");
exports.passportJWT = require("passport-jwt");
exports.rateLimit = require("express-rate-limit");
exports.Joi = require("joi");
exports.cryptoJS = require("crypto-js");
exports.helmet = require("helmet");
exports.compression = require("compression");
exports.jwt = require("jsonwebtoken");
exports.bcrypt = require("bcryptjs");
exports.jwt_decode = require("jwt-decode");
exports.crypto = require("crypto");
exports.moment = require("moment");
exports.sequelize = require("sequelize");
exports.uuid = require("node-uuid");

// helpers
exports.helpers = require("../config/helpers");

// Controller directories
exports.blogRoute = require("../routes/blogs");
exports.publicRoute = require("../routes/onboarding");
