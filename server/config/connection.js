const env = process.env;

const config = {
    db: {
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER || 'admin',
        password: env.DB_PASSWORD || 'admin',
        database: env.DB_NAME || 'webshop' //fill it in
    }
}

module.exports = config;