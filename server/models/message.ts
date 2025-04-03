import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

interface MessageAttributes {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id' | 'isRead' | 'createdAt' | 'updatedAt'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> {
    declare id: number;
    declare chatId: number;
    declare senderId: number;
    declare content: string;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Message.belongsTo(models.Chat, {
            foreignKey: 'chatId',
            as: 'chat'
        });
        Message.belongsTo(models.User, {
            foreignKey: 'senderId',
            as: 'sender'
        });
    }
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chats',
                key: 'id'
            }
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
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
        modelName: 'Message',
        tableName: 'messages',
    }
);

export default Message;