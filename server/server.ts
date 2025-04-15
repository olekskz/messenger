import express from "express";
import { createServer } from "node:http";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from "passport-jwt";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './controllers/authController';
import chatRoutes from './controllers/chatController';
import userRoutes from './controllers/userController';
import messageRoutes from './controllers/messageContoller';
import { setupAssociations } from "./models/associations";
import User from "./models/user";
import Chat from "./models/chat";
import Message from "./models/message";

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


interface JwtPayload {
    id: number;
    username: string;
}

interface SocketSendMessagePayload {
    content: string;
    sender_id: number;
    chat_id: number;
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
};

const verifyCallback: VerifyCallback = (jwtPayload: JwtPayload, done) => {
    try {
        return done(null, jwtPayload);
    } catch (error) {
        return done(error, false);
    }
};

passport.use(new JwtStrategy(jwtOptions, verifyCallback));

export const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true
  }
});

export const onlineUsers = new Map<number, string>()


io.on('connection', (socket) => {
    console.log('✅ New socket connected:', socket.id);

    socket.on('set-user-id', (userId: number) => {
        console.log('👤 Registered user:', userId, 'socket:', socket.id);
        onlineUsers.set(userId, socket.id);
        console.log('Updated onlineUsers:', onlineUsers);
    });

    socket.on("send-message", async (message: SocketSendMessagePayload) => {
        try {
            const newMessage = await Message.create({
                content: message.content,
                sender_id: message.sender_id,
                chat_id: message.chat_id
            });

            const chat = await Chat.findOne({
                where: { id: message.chat_id },
                include: [
                    { model: User, as: "userOne", attributes: ["id"] },
                    { model: User, as: "userTwo", attributes: ["id"] }
                ]
            });

            if (!chat) return;

            const recipientId =
                chat.user_one === message.sender_id
                    ? chat.user_two
                    : chat.user_one;

            const recipientSocketId = onlineUsers.get(recipientId);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("new-message", newMessage);
                console.log(`📨 Sent message to user ${recipientId}`);
            }

            io.emit("new-message", newMessage);

        } catch (err) {
            console.error("Error sending message:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log('Updated onlineUsers:', onlineUsers);
    });
});



app.use('/auth', authRoutes)
app.use('/chats', chatRoutes)
app.use('/users', userRoutes)
app.use('/messages', messageRoutes);

setupAssociations()

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});