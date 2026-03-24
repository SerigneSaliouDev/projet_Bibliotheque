const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/index');
const { registerSchema, loginSchema } = require('../validators/authValidator');

// ─── REGISTER ─────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    // 1. Valider les données avec Joi
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { name, email, password } = req.body;

    // 2. Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // 3. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 6. Retourner la réponse (sans le password !)
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error('Erreur register :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    // 1. Valider les données
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        errors: error.details.map(d => d.message),
      });
    }

    const { email, password } = req.body;

    // 2. Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 3. Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // 4. Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5. Retourner la réponse
    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error('Erreur login :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ─── PROFILE ──────────────────────────────────────────────────
const profile = async (req, res) => {
  try {
    // req.user est injecté par le middleware verifyToken
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error('Erreur profile :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = { register, login, profile };
