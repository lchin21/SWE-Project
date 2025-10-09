import {readdirSync} from "fs";
import {basename, dirname} from "path";
import {DataTypes, Sequelize} from "sequelize";
import {fileURLToPath} from 'url';
import dbConfig from "../config.js";

const env = process.env.NODE_ENV || 'development';

const config = dbConfig[env]

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};
let sequelize

// different environments, may not be necessary. May remove later
if (process.env.MYSQL_URL) {
    sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQLUSER, process.env.MYSQLPASSWORD, {
        host: process.env.MYSQLHOST,
        dialect: config.dialect,
        logging: false,
    });
} else {
    console.log("dev env")
    sequelize = new Sequelize(config.database, config.username, config.password, {
        host: process.env.MYSQLHOST,
        dialect: config.dialect,
        port: process.env.MYSQLPORT,
        logging: false,
    });
}

const files = readdirSync(__dirname)
    .filter(
        (file) => file.indexOf('.') !== 0
            && file !== basename(__filename)
            && file.slice(-3) === '.js',
    );

await Promise.all(files.map(async file => {
    const model = await import(`./${file}`);
    if (!model.default) {
        return;
    }
    const namedModel = model.default(sequelize, DataTypes);
    db[namedModel.name] = namedModel;
}))

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
