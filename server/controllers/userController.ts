import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateToken } from "../middleware/authController";
import User from "../models/user";

interface UserResponse {
    id: number;
    username: string;
    avatar: string;
    phone: string;
}

const router = Router()

router.get('/:id', authenticateToken as any, async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id
    try {
        
        const user = await User.findOne({
            where: { id },
            attributes: ['id', 'username', 'avatar', 'phone'],
        });

        if (!user) {
            return res.status(404).json({ 
                error: `User with ID ${id} not found` 
            });
        }

        
        const userData: UserResponse = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            phone: user.phone
        };

        return res.status(200).json(userData);

    } catch (error) {
        res.status(500).json({error: error})
    }
    
})

export default router;