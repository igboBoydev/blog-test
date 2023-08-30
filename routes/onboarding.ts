export {};
const express = require("express");
require("../config/passport");
const util = require("../utils/packages");
const router = express.Router();
const signatureSigner = require("../middlewares/personalSignature");
const passport = require("passport");
require("dotenv").config();

const Register = require("../controllers/Onboarding");
const LoginCtrl = require("../controllers/LoginCtrl");

router.post("/register", Register.register);
router.post("/login", LoginCtrl.login);

module.exports = router;
