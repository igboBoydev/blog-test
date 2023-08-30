export {};
require("dotenv").config();
const Sequelizes = require("sequelize");

const db: any = {};

var sequelize = new Sequelizes(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    define: {
      freezeTableName: true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to POSTGRES database has been established successfully"
    );
  })
  .catch((error: any) => {
    console.error("Unable to connect to POSTGRES database: ", error);
  });

db.sequelize = sequelize;

db.Users = require("../models/users.model")(sequelize, Sequelizes);
db.Oauth = require("../models/oauth.model")(sequelize, Sequelizes);
db.Blogs = require("../models/blogs.model")(sequelize, Sequelizes);

module.exports = db;
