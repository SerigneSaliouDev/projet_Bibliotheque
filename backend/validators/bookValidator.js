const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(255).required(),
  isbn: Joi.string().max(20).allow(null, ""),
  category_id: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).required(),
  available_quantity: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(1000).allow(null, ""),
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  author: Joi.string().min(1).max(255).optional(),
  isbn: Joi.string().max(20).allow(null, "").optional(),
  category_id: Joi.number().integer().positive().optional(),
  quantity: Joi.number().integer().min(1).optional(),
  available_quantity: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(1000).allow(null, "").optional(),
}).min(1);

module.exports = { createBookSchema, updateBookSchema };