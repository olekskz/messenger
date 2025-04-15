import { Router, type Request, type Response } from "express";
import { authenticateToken } from "../middleware/authController";
import Chat from "../models/chat";
import Message from "../models/message";

const router = Router()


router.get("/:chat_id", authenticateToken as any, async (req: Request, res: Response): Promise<any> => {
    const chat_id = parseInt(req.params.chat_id, 10);

    if (isNaN(chat_id)) {
        return res.status(400).json({ error: "Invalid chat_id" });
    }

    try {
        const messages = await Message.findAll({
            where: { chat_id: chat_id },
            include: [
                {
                    model: Chat,
                    as: 'chat' 
                }
            ]
        });

        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});



export default router;