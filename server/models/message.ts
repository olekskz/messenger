import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface MessageAttributes {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id' | 'isRead' | 'created_at' | 'updated_at'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> {
    declare id: number;
    declare chatId: number;
    declare senderId: number;
    declare content: string;
    declare createdAt: Date;
    declare updatedAt: Date;
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
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'messages',
        timestamps: true
    }
);

export default Message;