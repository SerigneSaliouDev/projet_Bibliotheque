const Joi = require("joi");

const createBorrowSchema = Joi.object({
  member_id: Joi.number().integer().positive().required(),
  book_id: Joi.number().integer().positive().required(),
  due_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "due_date doit être au format YYYY-MM-DD"
    })
});

module.exports = {
  createBorrowSchema
};