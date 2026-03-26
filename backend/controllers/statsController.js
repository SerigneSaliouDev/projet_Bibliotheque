const { fn, col, literal, Op } = require("sequelize");
const db = require("../models");
const { syncOverdueBorrows, getToday } = require("../services/borrowService");

const getBooksStats = async (req, res) => {
  try {
    const totalBooks = await db.Book.count();

    const totalAvailableRaw = await db.Book.sum("available_quantity");
    const totalAvailable = totalAvailableRaw || 0;

    const totalBorrowed = await db.Borrow.count({
      where: { status: "borrowed" }
    });

    const byCategory = await db.Book.findAll({
      attributes: [
        "category_id",
        [fn("COUNT", col("Book.id")), "count"]
      ],
      include: [
        {
          model: db.Category,
          as: "category",
          attributes: ["name"]
        }
      ],
      group: ["category_id", "category.id", "category.name"],
      raw: false
    });

    return res.status(200).json({
      totalBooks,
      totalAvailable,
      totalBorrowed,
      byCategory
    });
  } catch (error) {
    console.error("getBooksStats error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const getMembersStats = async (req, res) => {
  try {
    const totalMembers = await db.Member.count();
    const activeMembers = await db.Member.count({
      where: { status: "active" }
    });
    const inactiveMembers = await db.Member.count({
      where: { status: "inactive" }
    });

    return res.status(200).json({
      totalMembers,
      activeMembers,
      inactiveMembers
    });
  } catch (error) {
    console.error("getMembersStats error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const getBorrowsStats = async (req, res) => {
  try {
    await syncOverdueBorrows();

    const totalBorrows = await db.Borrow.count();
    const activeBorrows = await db.Borrow.count({
      where: { status: "borrowed" }
    });
    const returnedBorrows = await db.Borrow.count({
      where: { status: "returned" }
    });
    const today = getToday();
    const overdueBorrows = await db.Borrow.count({
      where: {
        [Op.or]: [
          { status: "overdue" },
          {
            status: "borrowed",
            due_date: { [Op.lte]: today }
          }
        ]
      }
    });

    const mostBorrowed = await db.Borrow.findAll({
      attributes: [
        "book_id",
        [fn("COUNT", col("Borrow.id")), "borrow_count"]
      ],
      include: [
        {
          model: db.Book,
          as: "book",
          attributes: ["title", "author"]
        }
      ],
      group: ["book_id", "book.id", "book.title", "book.author"],
      order: [[literal("borrow_count"), "DESC"]],
      limit: 5
    });

    return res.status(200).json({
      totalBorrows,
      activeBorrows,
      returnedBorrows,
      overdueBorrows,
      mostBorrowed
    });
  } catch (error) {
    console.error("getBorrowsStats error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  getBooksStats,
  getMembersStats,
  getBorrowsStats
};