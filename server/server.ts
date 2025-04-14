import express from "express";
import { type Request, type Response } from "express";
import { createServer } from "node:http";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from "passport-jwt";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './controllers/userController';
import { authenticateToken } from "./middleware/authController";
import chatRoutes from './controllers/chatController';
import { setupAssociations } from "./models/associations";
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
    });

    socket.on('disconnect', () => {
        console.log('❌ Socket disconnected:', socket.id);
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
    });
});


app.use('/auth', authRoutes)
app.use('/chats', chatRoutes)


setupAssociations()
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});