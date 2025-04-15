import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface MessageAttributes {
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
}

interface MessageCreationAttributes extends Omit<MessageAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Message extends Model<MessageAttributes, MessageCreationAttributes> {
    declare id: number;
    declare chat_id: number;
    declare sender_id: number;
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
        chat_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chats',
                key: 'id'
            }
        },
        sender_id: {
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
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default Message;