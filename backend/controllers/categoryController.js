const { Category, Book } = require('../models/index');
const { categorySchema } = require('../validators/categoryValidator');

// ─── GET ALL CATEGORIES ───────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const { Book } = require('../models/index');

    // Si Book existe, on inclut les livres, sinon on liste juste les catégories
    const includeOptions = Book ? [{
      model: Book,
      as: 'books',
      attributes: ['id'],
    }] : [];

    const categories = await Category.findAll({
      include: includeOptions,
    });

    return res.status(200).json(categories);

  } catch (error) {
    console.error('Erreur getCategories :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── CREATE CATEGORY ──────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    // 1. Valider les données
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { name, description } = req.body;

    // 2. Vérifier si le nom existe déjà
    const existing = await Category.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Ce nom de catégorie existe déjà' });
    }

    // 3. Créer la catégorie
    const category = await Category.create({ name, description });

    return res.status(201).json(category);

  } catch (error) {
    console.error('Erreur createCategory :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── UPDATE CATEGORY ──────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    // 1. Vérifier si la catégorie existe
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }

    // 2. Valider les données
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { name, description } = req.body;

    // 3. Vérifier si le nouveau nom existe déjà (pour une autre catégorie)
    const existing = await Category.findOne({ where: { name } });
    if (existing && existing.id !== category.id) {
      return res.status(400).json({ message: 'Ce nom de catégorie existe déjà' });
    }

    // 4. Mettre à jour
    await category.update({ name, description });

    return res.status(200).json(category);

  } catch (error) {
    console.error('Erreur updateCategory :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── DELETE CATEGORY ──────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    // 1. Vérifier si la catégorie existe
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie introuvable' });
    }

    // 2. Supprimer
    await category.destroy();

    return res.status(200).json({ message: 'Catégorie supprimée' });

  } catch (error) {
    console.error('Erreur deleteCategory :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };