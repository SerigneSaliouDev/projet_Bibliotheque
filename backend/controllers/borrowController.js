const db = require("../models");
const { createBorrowSchema } = require("../validators/borrowValidator");
const { syncOverdueBorrows, getToday } = require("../services/borrowService");

const listBorrows = async (req, res) => {
  try {
    await syncOverdueBorrows();

    const status = req.query.status || "";
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = req.query.limit ? Math.max(1, Number(req.query.limit)) : 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const result = await db.Borrow.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["id", "first_name", "last_name"]
        },
        {
          model: db.Book,
          as: "book",
          attributes: ["id", "title", "author"]
        }
      ]
    });

    return res.status(200).json({
      total: result.count,
      page,
      totalPages: Math.ceil(result.count / limit),
      borrows: result.rows
    });
  } catch (error) {
    console.error("listBorrows error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const createBorrow = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    await syncOverdueBorrows();

    const { error, value } = createBorrowSchema.validate(req.body, {
      abortEarly: false
    });

    if (error) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Données invalides",
        errors: error.details.map((d) => d.message)
      });
    }

    const member = await db.Member.findByPk(value.member_id, { transaction });
    if (!member) {
      await transaction.rollback();
      return res.status(404).json({ message: "Membre introuvable" });
    }

    if (member.status !== "active") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Le membre doit être actif pour emprunter un livre"
      });
    }

    const book = await db.Book.findByPk(value.book_id, { transaction });
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: "Livre introuvable" });
    }

    if (book.available_quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Aucun exemplaire disponible pour ce livre"
      });
    }

    const borrow = await db.Borrow.create(
      {
        member_id: value.member_id,
        book_id: value.book_id,
        borrow_date: getToday(),
        due_date: value.due_date,
        status: "borrowed"
      },
      { transaction }
    );

    await book.update(
      {
        available_quantity: book.available_quantity - 1
      },
      { transaction }
    );

    await transaction.commit();

    const createdBorrow = await db.Borrow.findByPk(borrow.id, {
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["id", "first_name", "last_name"]
        },
        {
          model: db.Book,
          as: "book",
          attributes: ["id", "title", "author"]
        }
      ]
    });

    return res.status(201).json(createdBorrow);
  } catch (error) {
    await transaction.rollback();
    console.error("createBorrow error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

const returnBorrow = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    await syncOverdueBorrows();

    const id = Number(req.params.id);

    const borrow = await db.Borrow.findByPk(id, { transaction });
    if (!borrow) {
      await transaction.rollback();
      return res.status(404).json({ message: "Emprunt introuvable" });
    }

    if (borrow.status === "returned") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Cet emprunt a déjà été retourné"
      });
    }

    const book = await db.Book.findByPk(borrow.book_id, { transaction });
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: "Livre introuvable" });
    }

    await borrow.update(
      {
        status: "returned",
        return_date: getToday()
      },
      { transaction }
    );

    await book.update(
      {
        available_quantity: book.available_quantity + 1
      },
      { transaction }
    );

    await transaction.commit();

    const updatedBorrow = await db.Borrow.findByPk(id, {
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["id", "first_name", "last_name"]
        },
        {
          model: db.Book,
          as: "book",
          attributes: ["id", "title", "author"]
        }
      ]
    });

    return res.status(200).json({
      message: "Livre retourné avec succès",
      borrow: updatedBorrow
    });
  } catch (error) {
    await transaction.rollback();
    console.error("returnBorrow error:", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  listBorrows,
  createBorrow,
  returnBorrow
};