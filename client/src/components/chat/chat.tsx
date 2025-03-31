import React, {useState, useEffect} from "react";
import "./chat.css";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        // Fetch messages from the server when the component mounts
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/messages");
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
}


export default Chat;
