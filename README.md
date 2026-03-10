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

#### `GET /api/stats/books` — Réponse

```json
{
  "totalBooks": 42,
  "totalAvailable": 30,
  "totalBorrowed": 12,
  "byCategory": [
    {
      "category_id": 1,
      "count": 15,
      "category": { "name": "Roman" }
    },
    {
      "category_id": 2,
      "count": 10,
      "category": { "name": "Sciences" }
    }
  ]
}
```

| Variable | Type | Description |
|----------|------|-------------|
| `totalBooks` | `number` | Nombre total de livres enregistrés |
| `totalAvailable` | `number` | Somme des quantités disponibles à l'emprunt |
| `totalBorrowed` | `number` | Nombre d'emprunts actuellement actifs (status = borrowed) |
| `byCategory` | `array` | Répartition du nombre de livres par catégorie |
| `byCategory[].category_id` | `number` | ID de la catégorie |
| `byCategory[].count` | `number` | Nombre de livres dans cette catégorie |
| `byCategory[].category.name` | `string` | Nom de la catégorie |

---

#### `GET /api/stats/members` — Réponse

```json
{
  "totalMembers": 100,
  "activeMembers": 85,
  "inactiveMembers": 15
}
```

| Variable | Type | Description |
|----------|------|-------------|
| `totalMembers` | `number` | Nombre total de membres inscrits |
| `activeMembers` | `number` | Membres avec le statut `active` |
| `inactiveMembers` | `number` | Membres avec le statut `inactive` |

---

#### `GET /api/stats/borrows` — Réponse

```json
{
  "totalBorrows": 200,
  "activeBorrows": 12,
  "returnedBorrows": 183,
  "overdueBorrows": 5,
  "mostBorrowed": [
    {
      "book_id": 3,
      "borrow_count": "18",
      "book": {
        "title": "Le Petit Prince",
        "author": "Antoine de Saint-Exupéry"
      }
    }
  ]
}
```

| Variable | Type | Description |
|----------|------|-------------|
| `totalBorrows` | `number` | Nombre total d'emprunts (toutes périodes) |
| `activeBorrows` | `number` | Emprunts en cours (non retournés) |
| `returnedBorrows` | `number` | Emprunts soldés (livre retourné) |
| `overdueBorrows` | `number` | Emprunts actifs dont la date de retour est dépassée |
| `mostBorrowed` | `array` | Top 5 des livres les plus empruntés |
| `mostBorrowed[].book_id` | `number` | ID du livre |
| `mostBorrowed[].borrow_count` | `string` | Nombre total d'emprunts pour ce livre |
| `mostBorrowed[].book.title` | `string` | Titre du livre |
| `mostBorrowed[].book.author` | `string` | Auteur du livre |

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
