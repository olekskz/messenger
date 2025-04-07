import { Router, type Request, type Response } from "express";
import User from "../models/user"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

        await User.create({
            username,
            phone,
            password: hashedPassword,
        });

        const token = jwt.sign({ username, phone }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
            
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

        if (validPassword) {
            const token = jwt.sign(
                { username: user.username, phone: user.phone },
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

export default router;