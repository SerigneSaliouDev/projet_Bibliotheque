const { Op } = require("sequelize");
const db = require("../models");

const getToday = () => new Date().toISOString().slice(0, 10);

const syncOverdueBorrows = async () => {
  const today = getToday();

  await db.Borrow.update(
    { status: "overdue" },
    {
      where: {
        status: "borrowed",
        return_date: null,
        due_date: {
          [Op.lte]: today
        }
      }
    }
  );
};

module.exports = {
  getToday,
  syncOverdueBorrows
};