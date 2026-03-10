# Gestion de Bibliothèque — Frontend

Interface web React pour l'application de gestion de bibliothèque.

---

## Présentation du projet

Application complète de gestion de bibliothèque composée de deux parties :

| Partie | Technologie | Port |
|--------|-------------|------|
| Backend API | Node.js + Express + MySQL + Sequelize | 5000 |
| Frontend | React + Vite + Bootstrap 5 | 3000 |

### Fonctionnalités

- **Authentification** — Connexion sécurisée par JWT
- **Tableau de bord** — Statistiques en temps réel (livres, membres, emprunts)
- **Livres** — Gestion complète avec upload de couverture, recherche et pagination
- **Catégories** — Création et organisation des catégories de livres
- **Membres** — Gestion des membres de la bibliothèque
- **Emprunts** — Suivi des emprunts et retours de livres

---

## Prérequis

Assurez-vous d'avoir installé :

- [npm](https://www.npmjs.com) v8 ou supérieur
- MySQL 8 ou supérieur (requis pour le backend)

---

### 3. Installer et démarrer le Frontend

Ouvrir un nouveau terminal :

```bash
cd frontend

# Installer les dépendances
npm install

# (Optionnel) Copier le fichier de configuration
cp .env.example .env
```

Contenu du fichier `.env` (optionnel, valeur par défaut déjà configurée) :

```env
VITE_API_URL=http://localhost:5000/api
```

Démarrer l'application :

```bash
npm run dev
```

Le frontend démarre sur **http://localhost:3000**

---
## Structure du projet Frontend
```
frontend/
├── index.html                  # Point d'entrée HTML
├── vite.config.js              # Configuration Vite + proxy API
├── package.json
└── src/
    ├── main.jsx                # Point d'entrée React
    ├── App.jsx                 # Routage principal
    ├── context/
    │   └── AuthContext.jsx     # Gestion de l'authentification
    ├── services/
    │   └── api.js              # Client HTTP Axios
    ├── components/
    │   └── Layout/
    │       ├── Layout.jsx      # Mise en page principale
    │       ├── Sidebar.jsx     # Menu de navigation
    │       └── Navbar.jsx      # Barre supérieure
    └── pages/
        ├── LoginPage.jsx       # Page de connexion
        ├── DashboardPage.jsx   # Tableau de bord
        ├── BooksPage.jsx       # Gestion des livres
        ├── CategoriesPage.jsx  # Gestion des catégories
        ├── MembersPage.jsx     # Gestion des membres
        └── BorrowsPage.jsx     # Gestion des emprunts
```

---

## Structure du projet Backend

```
backend/
├── app.js                      # Configuration Express
├── server.js                   # Démarrage du serveur
├── package.json
├── .env                        # Variables d'environnement
├── uploads/                    # Images de couverture des livres
├── config/
│   └── db.js                   # Connexion Sequelize / MySQL
├── models/
│   ├── index.js                # Associations entre modèles
│   ├── User.js                 # Modèle utilisateur
│   ├── Category.js             # Modèle catégorie
│   ├── Book.js                 # Modèle livre
│   ├── Member.js               # Modèle membre
│   └── Borrow.js               # Modèle emprunt
├── controllers/                # Logique métier
├── routes/                     # Définition des routes API
├── middleware/
│   ├── auth.js                 # Vérification JWT
│   ├── errorHandler.js         # Gestion des erreurs
│   └── upload.js               # Upload d'images (Multer)
└── validators/                 # Validation des données (Joi)
```

---

## API REST — Endpoints

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |
| GET | `/api/auth/profile` | Profil utilisateur connecté |

### Catégories
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/categories` | Liste des catégories |
| POST | `/api/categories` | Créer une catégorie |
| PUT | `/api/categories/:id` | Modifier une catégorie |
| DELETE | `/api/categories/:id` | Supprimer une catégorie |

### Livres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/books?search=&category_id=&page=&limit=` | Liste avec filtres |
| POST | `/api/books` | Créer un livre (multipart/form-data) |
| PUT | `/api/books/:id` | Modifier un livre |
| DELETE | `/api/books/:id` | Supprimer un livre |

### Membres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/members?search=&page=` | Liste des membres |
| POST | `/api/members` | Créer un membre |
| PUT | `/api/members/:id` | Modifier un membre |
| DELETE | `/api/members/:id` | Supprimer un membre |

### Emprunts
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/borrows?status=&page=` | Liste des emprunts |
| POST | `/api/borrows` | Créer un emprunt |
| PUT | `/api/borrows/return/:id` | Enregistrer un retour |

### Statistiques
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/stats/books` | Statistiques livres |
| GET | `/api/stats/members` | Statistiques membres |
| GET | `/api/stats/borrows` | Statistiques emprunts |

---

## Technologies utilisées
### Frontend
- **React 18** — Bibliothèque UI
- **Vite** — Bundler et serveur de développement
- **React Router v6** — Navigation
- **Axios** — Client HTTP
- **Bootstrap 5** — Framework CSS
- **Font Awesome 6** — Icônes
- **React Toastify** — Notifications

---

## Demarrage rapide (résumé)

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

Ouvrir **http://localhost:3000** et se connecter avec :
- Email : `admin@bibliotheque.com`
- Mot de passe : `admin123`
