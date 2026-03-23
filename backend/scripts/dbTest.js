require("dotenv").config();
const sequelize = require("../config/database");

(async () => {
  try {
    await sequelize.authenticate();
    console.log(" DB connected");
    process.exit(0);
  } catch (err) {
    console.error("DB connection error:", err.message);
    process.exit(1);
  }
})();
