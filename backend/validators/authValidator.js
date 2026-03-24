const Joi = require('joi');

// Schéma de validation pour l'inscription
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est obligatoire',
    }),

  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': "L'email est obligatoire",
    }),

  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est obligatoire',
    }),
});

// Schéma de validation pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': "L'email est obligatoire",
    }),

  password: Joi.string().required()
    .messages({
      'any.required': 'Le mot de passe est obligatoire',
    }),
});

module.exports = { registerSchema, loginSchema };