import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    phone: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> {
    declare id: number;
    declare username: string;
    declare password: string;
    declare phone: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare avatar: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true
    }
);

export default User;