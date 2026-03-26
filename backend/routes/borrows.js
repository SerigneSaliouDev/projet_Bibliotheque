const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth");
const {
  listBorrows,
  createBorrow,
  returnBorrow
} = require("../controllers/borrowController");

router.use(verifyToken);

router.get("/", listBorrows);
router.post("/", createBorrow);
router.put("/return/:id", returnBorrow);

module.exports = router;