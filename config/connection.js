const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    //127.0.0.1 works well for those running on a macOS, if on windows, please use 'localhost'
    dialect: "mysql",
    host: "127.0.0.1",
    port: 3306,
  }
);

module.exports = sequelize;
