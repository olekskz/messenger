import React, { useState, useEffect, useCallback } from "react";
import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
import getUserIdFromToken from "../../utils/getUserIdFromToken";
import { setLoading, setError, addMessage, setMessages } from "../../features/messageSlice";
import socket from "../../socket";
interface Message {
    id: number;
    content: string;
    created_at: string;
    sender_id: number;
    chat_id: number;
}

interface User {
    id: number;
    username: string;
    avatar: string;
    phone: string;
    email: string;
}

interface Chat {
    id: number;
    userOne: User;
    userTwo: User;
    user_one: number;
    user_two: number;
}

const Chat = () => {
    const [chatUserInfo, setChatUserInfo] = useState<boolean>(false);
    const [messageInput, setMessageInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const selectedChat = useSelector((state: any) => state.chats.selectedChat);
    const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
    const {messages, loading} = useSelector((state: any) => state.messages)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedChat) {
            setIsInitialLoad(false);
        }
    }, [selectedChat]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
    
            dispatch(setLoading());
    
            try {
                const response = await fetch(`http://localhost:3001/messages/${selectedChat.id}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    dispatch(setMessages(data) as any);
                } else {
                    dispatch(setError("Failed to load messages"));
                }
            } catch (err) {
                dispatch(setError("Something went wrong"));
            }
        };
    
        fetchMessages();
    }, [selectedChat]);

    const handleNewMessage = useCallback((message: Message) => {
        if (message.chat_id === selectedChat?.id) {
            dispatch(addMessage(message));
        }
    }, [selectedChat?.id, dispatch]);
    
    useEffect(() => {
        socket.on("new-message", handleNewMessage);
        return () => {
            socket.off("new-message", handleNewMessage);
        };
    }, [handleNewMessage]);

    const currentUserId = getUserIdFromToken();
    const otherUser = selectedChat ? 
        (selectedChat.user_one === currentUserId ? selectedChat.userTwo : selectedChat.userOne) 
        : null;

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(e.target.value);
    };

    const handleChatUserInfoClick = () => {
        setChatUserInfo(!chatUserInfo);
    }

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedChat) return;

        const message = {
            chat_id: selectedChat.id,
            sender_id: getUserIdFromToken(),
            content: messageInput.trim(),
        };

        try {
            socket.emit('send-message', message);
            setMessageInput(''); 
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    if (!selectedChat || !otherUser) {
        return <div className="chat-container hidden">Select a chat to start messaging</div>;
    }



    return (
        <div className={`chat-container ${chatUserInfo ? "shifted" : ""}`}>
            <div className="chats-header">
                <div className="chat-avatar">
                    <img 
                        src={otherUser.avatar || "/assets/default-avatar.png"} 
                        alt="chat-menu-avatar"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/default-avatar.png";
                        }}
                    />
                </div>
                <div className="chat-info">
                    <h1>{otherUser.username}</h1>
                </div>
                <div className="icons">
                    <img src="/assets/videocam_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="video-call" />
                    <img src="/assets/info_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="info-icon" onClick={handleChatUserInfoClick} />
                </div>
                <div className={`chat-user-info ${chatUserInfo ? "active" : ""}`} >
                    <img 
                        src={otherUser.avatar || "/assets/default-avatar.png"} 
                        alt="user-avatar"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/default-avatar.png";
                        }}
                    />
                    <h2>{otherUser.username}</h2>
                    <p>{otherUser.phone || 'No phone number'}</p>
                </div>
            </div>
            <div className="chat">
                  {loading ? (
                      <p>Loading...</p>
                  ) : messages.length === 0 ? (
                      <p>Loading...</p>
                  ) : (
                      messages.map((msg: Message) => (
                         <div key={msg.id} className={msg.sender_id === currentUserId ? 'users-message' : 'outgoing-message'}>
                            <p className="message-content">{msg.content}</p>
                            <p className={`message-timestamp-${msg.sender_id === currentUserId ? 'users' : 'outgoing'}-message`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      ))
                  )}
                </div>
                <div className="input-container">
                        <input 
                            type="text"
                            value={messageInput}
                            onChange={handleMessageChange}
                            placeholder="Type a message..."
                            autoComplete="off"
                        />
                        <button type="submit">
                            <img 
                                src="/assets/send_24dp_2854C5_FILL0_wght400_GRAD0_opsz24.png" 
                                alt="Send message"
                                onClick={handleSendMessage}
                            />
                        </button>
                </div>
            </div>
    );
}

export default Chat;
