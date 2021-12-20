const env = process.env;

const config = {
    db: {
        host: env.DB_HOST || 'localhost',
        user: env.DB_USER || 'admin',
        password: env.DB_PASSWORD || 'admin',
        database: env.DB_NAME || 'exam_webshop',
        connectionLimit : 10,
        pool: {
            idleTimeoutMillis: 30000,
          },
    },
    listPerPage: env.LIST_PER_PAGE || 24.
}

module.exports = config;