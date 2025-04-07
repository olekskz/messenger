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

dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


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

const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true
  }
});

app.use('/auth', authRoutes)
app.get('/main', authenticateToken as any, (req: Request, res: Response) => {
    if (!authenticateToken) {
        res.redirect('/')
    } else {
        res.status(201).json({message: 'There is an access'})
    }
} )

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});