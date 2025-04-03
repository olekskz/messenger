import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    phone: string;
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

    static associate(models: any) {
        User.hasMany(models.Chat, {
            foreignKey: 'userId',
            as: 'chats',
        });
    }
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
    }
);

export default User;