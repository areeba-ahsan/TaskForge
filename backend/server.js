require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/db');
require('./src/models/index'); // sab models aur unke associations load karne ke liye

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully (Neon PostgreSQL)');

    // Models ke basis pe tables create/update karo
    await sequelize.sync({ alter: true });
    console.log('✅ All models synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();