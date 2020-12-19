module.exports = [
    {
        name: 'default',
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'docker',
        database: 'mangafinder',
        entities: ['dist/**/entities/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
        cli: {
            migrationsDir: './src/database/migrations',
        },
    },
]
