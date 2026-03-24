const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // 2. Extraire le token (format: "Bearer eyJhbGci...")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Format token invalide' });
    }

    // 3. Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Injecter l'utilisateur dans la requête
    req.user = decoded; // { id, email, iat, exp }

    // 5. Passer à la suite
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = verifyToken;
