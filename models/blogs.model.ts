var Sequelize = require("sequelize");
import { Blogs } from "../interfaces/Blogs";

var blog: Blogs | any = (sequelize: any, type: any) => {
  return sequelize.define("blogs", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: Sequelize.INTEGER,
    uuid: Sequelize.STRING,
    post: Sequelize.STRING,
    is_deleted: Sequelize.INTEGER,
  });
};

module.exports = blog;
