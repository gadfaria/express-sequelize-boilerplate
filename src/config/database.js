require('./env');

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  // Falls back to the dialect's default port when empty
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true
  },
};

