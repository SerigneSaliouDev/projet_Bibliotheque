const { Op } = require('sequelize');
const { Member } = require('../models/index');
const { memberSchema } = require('../validators/memberValidator');

// ─── GET ALL MEMBERS ──────────────────────────────────────────
const getMembers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    // 1. Construire les filtres
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // 2. Pagination
    const offset = (page - 1) * limit;

    // 3. Récupérer les membres
    const { count, rows } = await Member.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      members: rows,
    });

  } catch (error) {
    console.error('Erreur getMembers :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── GET ONE MEMBER ───────────────────────────────────────────
const getMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);

    if (!member) {
      return res.status(404).json({ message: 'Membre introuvable' });
    }

    return res.status(200).json(member);

  } catch (error) {
    console.error('Erreur getMember :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── CREATE MEMBER ────────────────────────────────────────────
const createMember = async (req, res) => {
  try {
    // 1. Valider les données
    const { error } = memberSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { first_name, last_name, email, phone, address, membership_date, status } = req.body;

    // 2. Vérifier si l'email existe déjà
    if (email) {
      const existing = await Member.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    // 3. Créer le membre
    const member = await Member.create({
      first_name,
      last_name,
      email,
      phone,
      address,
      membership_date,
      status,
    });

    return res.status(201).json(member);

  } catch (error) {
    console.error('Erreur createMember :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── UPDATE MEMBER ────────────────────────────────────────────
const updateMember = async (req, res) => {
  try {
    // 1. Vérifier si le membre existe
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membre introuvable' });
    }

    // 2. Valider les données
    const { error } = memberSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { first_name, last_name, email, phone, address, membership_date, status } = req.body;

    // 3. Vérifier si le nouvel email existe déjà (pour un autre membre)
    if (email && email !== member.email) {
      const existing = await Member.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }

    // 4. Mettre à jour
    await member.update({
      first_name,
      last_name,
      email,
      phone,
      address,
      membership_date,
      status,
    });

    return res.status(200).json(member);

  } catch (error) {
    console.error('Erreur updateMember :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── DELETE MEMBER ────────────────────────────────────────────
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Membre introuvable' });
    }

    await member.destroy();

    return res.status(200).json({ message: 'Membre supprimé' });

  } catch (error) {
    console.error('Erreur deleteMember :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { getMembers, getMember, createMember, updateMember, deleteMember };