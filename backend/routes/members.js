const express = require('express');
const router = express.Router();
const {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} = require('../controllers/memberController');
const verifyToken = require('../middlewares/auth');

// Toutes les routes members sont protégées par JWT
router.get('/', verifyToken, getMembers);
router.get('/:id', verifyToken, getMember);
router.post('/', verifyToken, createMember);
router.put('/:id', verifyToken, updateMember);
router.delete('/:id', verifyToken, deleteMember);

module.exports = router;