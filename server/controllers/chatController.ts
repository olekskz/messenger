import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authController";
import Chat from "../models/chat";
import User from "../models/user";
import { Op } from "sequelize";
import {io} from "../server";
import { onlineUsers } from "../server";

const router = Router();

router.get('/get-chats', authenticateToken as any, async (req: Request, res: Response): Promise<any> => {
    try {
        const { query, page = 1, limit = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const whereClause = query ? {
            [Op.or]: [
                {
                    username: {
                        [Op.iLike]: `%${query}%`
                    }
                }
            ]
        } : {};

        const users = await User.findAndCountAll({
            where: whereClause,
            limit: Number(limit),
            offset: offset,
            distinct: true,
            attributes: ['id', 'username', 'avatar'], 
        });

        return res.status(200).json({
            users: users.rows,
            count: users.count,
            currentPage: Number(page),
            totalPages: Math.ceil(users.count / Number(limit))
        });
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
});

router.post('/add-chat', authenticateToken as any, async (req: Request, res: Response): Promise<any> => {
    try {
        const { user_one, user_two } = req.body;

        const userOneId = Number(user_one);
        const userTwoId = Number(user_two);

        if (!userOneId || !userTwoId) {
            return res.status(400).json({
                error: 'Both user_one and user_two are required and must be valid numbers'
            });
        }

        
        const [userOne, userTwo] = await Promise.all([
            User.findByPk(userOneId),
            User.findByPk(userTwoId)
        ]);

        if (!userOne || !userTwo) {
            return res.status(404).json({
                error: 'One or both users not found'
            });
        }

        
        const existingChat = await Chat.findOne({
            where: {
                [Op.or]: [
                    {
                        user_one: userOneId,
                        user_two: userTwoId
                    },
                    {
                        user_one: userTwoId,
                        user_two: userOneId
                    }
                ]
            }
        });

        if (existingChat) {
            return res.status(400).json({
                error: 'Chat already exists between these users'
            });
        }

        
        const newChat = await Chat.create({
            user_one: userOneId,
            user_two: userTwoId
        });

        
        const chatWithUsers = await Chat.findOne({
            where: { id: newChat.id },
            include: [
                {
                    model: User,
                    as: 'userOne',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: User,
                    as: 'userTwo',
                    attributes: ['id', 'username', 'avatar']
                }
            ]
        });

        
        const recipientSocketId = onlineUsers.get(userTwoId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('new-chat', chatWithUsers);
        }

        return res.status(201).json(chatWithUsers);
    } catch (error) {
        console.error('Error creating chat:', error);
        return res.status(500).json({
            error: 'Failed to create chat',
        });
    }
});

router.get('/:id', authenticateToken as any, async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = parseInt(req.params.id);


        const chats = await Chat.findAll({
            where: {
                [Op.or]: [
                    { user_one: userId },
                    { user_two: userId }
                ]
            },
            include: [
                {
                    model: User,
                    as: 'userOne',
                    attributes: ['id', 'username', 'avatar']
                },
                {
                    model: User,
                    as: 'userTwo',
                    attributes: ['id', 'username', 'avatar']
                }
            ],
            order: [['createdAt', 'DESC']] 
        });

        return res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({
            error: 'Failed to fetch chats'
        });
    }
});

export default router;