import {readdirSync} from "fs";
import {basename, dirname} from "path";
import {DataTypes, Sequelize} from "sequelize";
import {fileURLToPath} from 'url';
import getConfig from "../config.js";
import dotenv from "dotenv"
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};
let sequelize

const config = getConfig()

sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false,
});

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
