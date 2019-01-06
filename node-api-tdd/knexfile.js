module.exports = {
    test: {
        client: 'pg',
        version: '9.6',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: 'password',
            database: 'api_database',
        },
        migrations: {
            directory: 'src/migrations',
        },
    },
};
