const express = require('express');
const router = express.Router();

const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

const verifyToken = require('../middlewares/auth');
const upload = require("../middlewares/upload");

// Protection de toutes les routes
router.use(verifyToken);

// Routes
router.get('/', getBooks);
router.get('/:id', getBook);

//  Upload image ici
router.post('/', upload.single('cover_image'), createBook);
router.put('/:id', upload.single('cover_image'), updateBook);

router.delete('/:id', deleteBook);

module.exports = router;