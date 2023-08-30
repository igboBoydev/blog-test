import { IUser } from "../interfaces/Users";

var Sequelize = require("sequelize");

var User: IUser | any = (sequelize: any, type: any) => {
  return sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    mobile: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  });
};

module.exports = User;
