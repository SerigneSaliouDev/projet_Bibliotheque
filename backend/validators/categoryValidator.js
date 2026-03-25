const Joi = require('joi');

const categorySchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est obligatoire',
    }),

  description: Joi.string().max(500).allow('', null)
    .messages({
      'string.max': 'La description ne peut pas dépasser 500 caractères',
    }),
});

module.exports = { categorySchema };