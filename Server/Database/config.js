const getConfig = () => ({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Note: This will be a string, convert to number if needed by your ORM
    dialect: process.env.DB_DIALECT,
});

export default getConfig