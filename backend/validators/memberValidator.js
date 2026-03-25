const Joi = require('joi');

const memberSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required()
    .messages({
      'string.min': 'Le prénom doit contenir au moins 1 caractère',
      'string.max': 'Le prénom ne peut pas dépasser 100 caractères',
      'any.required': 'Le prénom est obligatoire',
    }),

  last_name: Joi.string().min(1).max(100).required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 1 caractère',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est obligatoire',
    }),

  email: Joi.string().email().allow('', null)
    .messages({
      'string.email': 'Email invalide',
    }),

  phone: Joi.string().max(20).allow('', null)
    .messages({
      'string.max': 'Le téléphone ne peut pas dépasser 20 caractères',
    }),

  address: Joi.string().max(500).allow('', null)
    .messages({
      'string.max': "L'adresse ne peut pas dépasser 500 caractères",
    }),

  membership_date: Joi.date().iso().allow('', null)
    .messages({
      'date.format': 'La date doit être au format YYYY-MM-DD',
    }),

  status: Joi.string().valid('active', 'inactive').allow('', null)
    .messages({
      'any.only': 'Le statut doit être active ou inactive',
    }),
});

module.exports = { memberSchema };