import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

interface ChatAttributes {
    id: number;
    senderId: number;
    receiverId: number;
    lastMessage: string;
    lastMessageAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface ChatCreationAttributes extends Omit<ChatAttributes, 'id' | 'lastMessage' | 'lastMessageAt' | 'createdAt' | 'updatedAt'> {}

export class Chat extends Model<ChatAttributes, ChatCreationAttributes> {
    declare id: number;
    declare senderId: number;
    declare receiverId: number;
    declare lastMessage: string;
    declare lastMessageAt: Date;
    declare createdAt: Date;
    declare updatedAt: Date;

    static associate(models: any) {
        Chat.belongsTo(models.User, {
            foreignKey: 'senderId',
            as: 'sender'
        });
        Chat.belongsTo(models.User, {
            foreignKey: 'receiverId',
            as: 'receiver'
        });
        Chat.hasMany(models.Message, {
            foreignKey: 'chatId',
            as: 'messages'
        });
    }
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        lastMessage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastMessageAt: {
            type: DataTypes.DATE,
            allowNull: true
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
        modelName: 'Chat',
        tableName: 'chats',
    }
);

export default Chat;

