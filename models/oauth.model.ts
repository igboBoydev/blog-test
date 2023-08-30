var Sequelize = require("sequelize");

var Oauth = (sequelize: any, type: any) => {
  return sequelize.define("oauth", {
    no: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id: Sequelize.STRING,
    email: Sequelize.STRING,
    iat: Sequelize.INTEGER,
    exp: Sequelize.INTEGER,
  });
};

module.exports = Oauth;
