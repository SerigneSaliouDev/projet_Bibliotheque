const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth");
const {
  getBooksStats,
  getMembersStats,
  getBorrowsStats
} = require("../controllers/statsController");

router.use(verifyToken);

router.get("/books", getBooksStats);
router.get("/members", getMembersStats);
router.get("/borrows", getBorrowsStats);

module.exports = router;