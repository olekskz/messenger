import React, { useState, useEffect } from "react";
import { useView } from "../../hooks/chatMenuContext";
import AddChatModal from "../AddChatModal/AddChatModal";
import "./chatMenu.css";
import { useNavigate } from "react-router-dom";
import getUserIdFromToken from '../../utils/getUserIdFromToken';
import socket from "../../socket";
import { useSelector, useDispatch } from 'react-redux';
import { setChats, addChat, setSelectedChat } from '../../features/chatSlice';
import {setUserProfile} from "../../features/userSlice";

interface Chat {
    id: number;
    user_one: number;
    user_two: number;
    userOne: {
        username: string;
        avatar: string;
    };
    userTwo: {
        username: string;
        avatar: string ;
    };
}

interface UserProfile {
    id: number;
    username: string;
    avatar: string;
    phone: string;
}

const ChatMenu = () => {
    const { currentView, setCurrentView } = useView();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const chats = useSelector((state: any) => state.chats);
    const userProfile = useSelector((state: any) => state.user.profile);
    const navigate = useNavigate()

    const handleAddChatClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleBackClick = () => {
        setCurrentView('chats');
    };

    const handleLogout = () => {
        sessionStorage.removeItem("token")
        socket.disconnect()
        navigate('/')
    }

    const selectChat = (chat: any) => {
        dispatch(setSelectedChat(chat))
    }

    useEffect(() => {
        const userId = getUserIdFromToken();
        if (userId) {
            socket.connect();
            socket.emit('set-user-id', userId);
        }
      }, []);
    

    useEffect(() => {
        const handleNewChat = (chat: any) => {
            dispatch(addChat(chat));
        }
        socket.on('new-chat', handleNewChat);
        
        return () => {
            socket.off('new-chat', handleNewChat); 
        };
    });


    useEffect(() => {
        const fetchChats = async () => {
            const userId = getUserIdFromToken()

            try {
                const response = await fetch(`http://localhost:3001/chats/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch(setChats(data));
                } else {
                    setError('Failed to load chats');
                }
            } catch (error) {
                setError('An error occurred while fetching chats');
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [dispatch]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const userId = getUserIdFromToken();
            if (!userId) return;
    
            try {
                const response = await fetch(`http://localhost:3001/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    dispatch(setUserProfile(data) as any);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };
    
        fetchUserProfile();
    }, [dispatch]);

    return (
        <div className="chats-box">
            {currentView === 'chats' && (
                <>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : chats?.chats?.length > 0 ? (
                        chats.chats.map((chat: Chat) => {
                            const otherUser = chat.user_one === getUserIdFromToken() 
                                ? chat.userTwo 
                                : chat.userOne;
                            return (
                                <div key={chat.id} className="chat-menu">
                                    <div className="chat-menu-avatar" onClick={() => {selectChat(chat)}}>
                                        <img 
                                            src={otherUser?.avatar} 
                                            alt="chat-menu-avatar" 
                                        />
                                    </div>
                                    <div className="chat-menu-info">
                                        <h1>{otherUser?.username}</h1>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No chats available</p>
                    )}
                    <div className="add-chat" onClick={handleAddChatClick}>
                        <img 
                            src="/assets/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" 
                            alt="add-chat" 
                        />
                    </div>
                </>
            )}

            {currentView === 'profile' && (
                <div className="user-info">
                    <img src="/assets/arrow_back_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="back" onClick={handleBackClick} />
                    <img src={userProfile.avatar} alt="user-avatar" />
                    <h2>{userProfile.username || 'Loading...'}</h2>
                    <p>{userProfile.phone || 'Loading...'}</p>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}

            {currentView === 'search' && (
                <div className="search-results">
                    {/* Тут будуть результати пошуку */}
                </div>
            )}

            <AddChatModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default ChatMenu;