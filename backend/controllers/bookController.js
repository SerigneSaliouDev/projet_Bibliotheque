const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { Book, Category } = require('../models/index');

// ─── GET ALL BOOKS ────────────────────────────────────────────
const getBooks = async (req, res) => {
  try {
    const { search, category_id, page = 1, limit = 10 } = req.query;

    const where = {};

    if (category_id) {
      where.category_id = category_id;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Book.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      books: rows,
    });

  } catch (error) {
    console.error('Erreur getBooks :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── GET ONE BOOK ─────────────────────────────────────────────
const getBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });

    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    return res.status(200).json(book);

  } catch (error) {
    console.error('Erreur getBook :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── CREATE BOOK ──────────────────────────────────────────────
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category_id, description, quantity, available_quantity } = req.body;

    // Validations basiques
    if (!title || !author || !category_id) {
      return res.status(400).json({ message: 'Titre, auteur et catégorie sont obligatoires' });
    }

    // Vérifier si la catégorie existe
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ message: 'Catégorie introuvable' });
    }

    // Vérifier l'ISBN unique si fourni
    if (isbn && isbn.trim() !== '') {
      const existing = await Book.findOne({ where: { isbn } });
      if (existing) {
        return res.status(400).json({ message: 'Cet ISBN existe déjà' });
      }
    }

    // Image de couverture (si uploadée via multer)
    const cover_image = req.file ? req.file.filename : null;

    const book = await Book.create({
      title,
      author,
      isbn: isbn && isbn.trim() !== '' ? isbn : null,
      category_id,
      description,
      quantity: parseInt(quantity) || 1,
      available_quantity: parseInt(available_quantity) || parseInt(quantity) || 1,
      cover_image,
    });

    // Récupérer le livre avec sa catégorie
    const bookWithCategory = await Book.findByPk(book.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });

    return res.status(201).json(bookWithCategory);

  } catch (error) {
    console.error('Erreur createBook :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── UPDATE BOOK ──────────────────────────────────────────────
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    const { title, author, isbn, category_id, description, quantity, available_quantity } = req.body;

    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ message: 'Catégorie introuvable' });
      }
    }

    // Vérifier l'ISBN unique si modifié
    if (isbn && isbn.trim() !== '' && isbn !== book.isbn) {
      const existing = await Book.findOne({ where: { isbn } });
      if (existing) {
        return res.status(400).json({ message: 'Cet ISBN existe déjà' });
      }
    }

    // Nouvelle image de couverture
    let cover_image = book.cover_image;
    if (req.file) {
      // Supprimer l'ancienne image si elle existe
      if (book.cover_image) {
        const oldPath = path.join(__dirname, '../uploads', book.cover_image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      cover_image = req.file.filename;
    }

    await book.update({
      title: title || book.title,
      author: author || book.author,
      isbn: isbn && isbn.trim() !== '' ? isbn : null,
      category_id: category_id || book.category_id,
      description,
      quantity: parseInt(quantity) || book.quantity,
      available_quantity: parseInt(available_quantity) ?? book.available_quantity,
      cover_image,
    });

    const bookWithCategory = await Book.findByPk(book.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });

    return res.status(200).json(bookWithCategory);

  } catch (error) {
    console.error('Erreur updateBook :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── DELETE BOOK ──────────────────────────────────────────────
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre introuvable' });
    }

    // Supprimer l'image de couverture si elle existe
    if (book.cover_image) {
      const imgPath = path.join(__dirname, '../uploads', book.cover_image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await book.destroy();

    return res.status(200).json({ message: 'Livre supprimé' });

  } catch (error) {
    console.error('Erreur deleteBook :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook };
