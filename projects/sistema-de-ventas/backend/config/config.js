module.exports = {
    PORT: process.env.PORT || 3005,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '1234',
    DB_NAME: process.env.DB_NAME || 'pos_db',
    JWT_SECRET: process.env.JWT_SECRET || 'pos_secret_key_2024',
    JWT_EXPIRES: '24h'
};