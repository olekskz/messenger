import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface ChatAttributes {
    id: number;
    user_one: number;
    user_two: number;
}

interface ChatCreationAttributes extends Omit<ChatAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Chat extends Model<ChatAttributes, ChatCreationAttributes> {
    declare id: number;
    declare user_one: number;
    declare user_two: number;
    declare created_at: Date;
    declare updated_at: Date;

}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_one: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        user_two: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: true,
        underscored: true  
    }
);

export default Chat;

