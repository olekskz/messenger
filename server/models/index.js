import { Sequelize } from 'sequelize';
import config from '../config/config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'postgres'
    }
);

export default sequelize;