const sequelize = require('../config/database');
const User = require('./User');
const Member = require('./Member');
const Category = require("./Category");
const Book = require("./Book");
const Borrow = require("./Borrow");

const db = {
  sequelize,
  User,
  Category,
  Book,
  Member,
  Borrow
};

// Relations Category <-> Book
Category.hasMany(Book, { foreignKey: "category_id", as: "books" });
Book.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Relations Member <-> Borrow
Member.hasMany(Borrow, { foreignKey: "member_id", as: "borrows" });
Borrow.belongsTo(Member, { foreignKey: "member_id", as: "member" });

// Relations Book <-> Borrow
Book.hasMany(Borrow, { foreignKey: "book_id", as: "borrows" });
Borrow.belongsTo(Book, { foreignKey: "book_id", as: "book" });

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
module.exports = db;