import { Router, type Request, type Response } from "express";
import User from "../models/user"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary";
import { io } from "../server";
import { onlineUsers } from "../server";

dotenv.config();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "avatar",
      format: "jpg", 
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

const upload = multer({ storage });

type UserTypes = {
    username: string;
    password: string;
}

const router = Router();

router.post("/register", async (req: Request, res: Response): Promise<any> => {
    const { username, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const existingPhone = await User.findOne({ where: { phone } });
        if (existingPhone) {
            return res.status(400).json({ error: "Phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            phone,
            password: hashedPassword,
            avatar: ""
        });

        const token = jwt.sign({ 
            id: newUser.id,
            username: newUser.username, 
            phone: newUser.phone 
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        io.on("connection", (socket) => {
            console.log("Client connected");
          
            socket.on("user-connected", (userId: number) => {
              onlineUsers.set(userId, socket.id);
              console.log(`${userId} is online with socket ${socket.id}`);
            });
          
            socket.on("disconnect", () => {
              for (const [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                  onlineUsers.delete(userId);
                  console.log(`${userId} disconnected`);
                  break;
                }
              }
            });
          });

        return res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

router.post("/login", async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            where: { username }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        io.on("connection", (socket) => {
            console.log("Client connected");
          
            socket.on("user-connected", (userId: number) => {
              onlineUsers.set(userId, socket.id);
              console.log(`${userId} is online with socket ${socket.id}`);
            });
          
            socket.on("disconnect", () => {
              for (const [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                  onlineUsers.delete(userId);
                  console.log(`${userId} disconnected`);
                  break;
                }
              }
            });
          });

        if (validPassword) {
            const token = jwt.sign(
                {   
                    id: user.id,
                    username: user.username,
                    phone: user.phone 
                },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );
    
            return res.status(200).json({
                message: 'Login successful',
                token
            });
        } else {
            return res.status(500).json({message: "Wrong login or password"})
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/upload-avatar', upload.single('avatar'), async (req: Request, res: Response): Promise<any> => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }

        const token = authHeader.split(' ')[1];
        
        interface TokenPayload {
            id: number;
            username: string;
            phone: string;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        

        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.update(
            { avatar: req.file.path },
            { where: { id: decoded.id } }
        );

        return res.status(200).json({ 
            message: 'Avatar uploaded successfully',
        });

    } catch (error) {
        console.error('Error uploading avatar:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        return res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

export default router;