export {};
const db = require("../Database/postgres");
const sendError = (message: string) => {
  var error = {
    status: "ERROR",
    message,
  };

  return error;
};

const sendSuccess = (message: string) => {
  var success = {
    status: "SUCCESS",
    message,
  };

  return success;
};

const checkMobile = async (req: any) => {
  return await db.Users.findOne({ where: { mobile: req.body.mobile } });
  // return await db.Users.findOne({
  //   where: { mobile: req.body.mobile },
  // });
};

const checkMail = async (req: any) => {
  return await db.Users.findOne({ where: { email: req.body.email } });
  // return await db.Users.findOne({ where: { email: req.body.email } });
};

module.exports = {
  sendError,
  checkMobile,
  checkMail,
  sendSuccess,
};
