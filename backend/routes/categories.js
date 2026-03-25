const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const verifyToken = require('../middlewares/auth');

// Toutes les routes categories sont protégées par JWT
router.get('/', verifyToken, getCategories);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

module.exports = router;