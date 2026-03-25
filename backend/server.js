const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');

// Charge les variables d'environnement du fichier .env


const app = express();

// ─── Middlewares globaux ───────────────────────────────────────
app.use(cors());                          // Autorise les requêtes depuis le frontend (port 3000)
app.use(express.json());                  // Parse le body JSON des requêtes
app.use(express.urlencoded({ extended: true })); // Parse les formulaires (utile pour Multer)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Sert les images statiquement


// ─── Routes (on les branchera au fur et à mesure) ─────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/members', require('./routes/members'));
app.use("/api/books", require("./routes/books"));

// ─── Route de test ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🚀 API Bibliothèque opérationnelle' });
});

// ─── Démarrage du serveur ─────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});