import User from './user';
import Chat from './chat';
import Message from './message';


export const setupAssociations = () => {
    
    User.hasMany(Chat, {
        foreignKey: 'user_one',
        as: 'chatsAsUserOne'
    });
    User.hasMany(Chat, {
        foreignKey: 'user_two',
        as: 'chatsAsUserTwo'
    });

    
    Chat.belongsTo(User, {
        foreignKey: 'user_one',
        as: 'userOne'
    });
    Chat.belongsTo(User, {
        foreignKey: 'user_two',
        as: 'userTwo'
    });

    
    Message.belongsTo(Chat, {
        foreignKey: 'chatId',
        as: 'chat'
    });
    Message.belongsTo(User, {
        foreignKey: 'senderId',
        as: 'sender'
    });
};