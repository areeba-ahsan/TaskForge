const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // true kardo agar SQL queries terminal mein dekhni hain
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Neon ko SSL chahiye hota hai
    },
  },
});

// Connection test karne ka function
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully (Neon PostgreSQL)');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1); // agar connect na ho paye, server band kardo
  }
};

module.exports = { sequelize, connectDB };