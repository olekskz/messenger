import React, {useState, useEffect} from "react";
import "./chat.css";

interface Message {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
}

const Chat = () => {

    const [chatUserInfo, setChatUserInfo] = useState<boolean>(false);
    const [messageInput, setMessageInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };

    const handleChatUserInfoClick = () => {
        setChatUserInfo(!chatUserInfo);
    }

    return (
        <div className={`chat-container ${chatUserInfo ? "shifted" : ""}`}>
            <div className="chats-header">
                <div className="chat-avatar">
                    <img src="/assets/avatar.avif" alt="chat-menu-avatar" />
                </div>
                <div className="chat-info">
                    <h1>Chat Name</h1>
                </div>
                <div className="icons">
                    <img src="/assets/videocam_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="video-call" />
                    <img src="/assets/info_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="info-icon" onClick={handleChatUserInfoClick} />
                </div>
                <div className={`chat-user-info ${chatUserInfo ? "active" : ""}`} >
                    <img src="/assets/avatar.avif" alt="user-avatar" />
                    <h2>User Name</h2>
                    <p>+380 XX XXX XX XX</p>
                    <p>username@email.com</p>
                </div>
            </div>
            <div className="chat">
                <div className="users-message">
                    <p className="message-content">Hello</p>
                    <p className="message-timestamp-users-message">12.30</p>
                </div>
                <div className="outgoing-message">
                    <p className="message-content">Hi</p>
                    <p className="message-timestamp-outgoing-message">12.30</p>
                </div>
                <div className="input-container">
                    <input type="text" className="message-input" placeholder="Type a message" onChange={handleMessageChange} />
                    <img src="/assets/send_24dp_2854C5_FILL0_wght400_GRAD0_opsz24.png" alt="send-icon" />
                </div>
            </div>
        </div>
    );
}


export default Chat;
