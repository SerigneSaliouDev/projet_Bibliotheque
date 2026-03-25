const sequelize = require('../config/database');
const User = require('./User');
const Member = require('./Member');

// Modèles du Dev B (importés seulement s'ils existent)
let Book = null;
let Category = null;

try { Book = require('./Book'); } catch (e) {}
try { Category = require('./Category'); } catch (e) {}

// ─── Associations ─────────────────────────────────────────────
if (Book && Category) {
  Book.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Category.hasMany(Book, { foreignKey: 'category_id', as: 'books' });
}

// ─── Synchronisation & Seed Admin ─────────────────────────────
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(' Tables synchronisées avec MySQL');

    const bcrypt = require('bcryptjs');
    const adminExists = await User.findOne({ 
      where: { email: 'admin@bibliotheque.com' } 
    });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Administrateur',
        email: 'admin@bibliotheque.com',
        password: hashedPassword,
      });
      console.log(' Compte admin créé : admin@bibliotheque.com / admin123');
    }

  } catch (error) {
    console.error('Erreur synchronisation :', error.message);
  }
};

syncDatabase();

module.exports = { sequelize, User, Book, Category, Member };