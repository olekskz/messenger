import React, { useState } from "react";
import { useView } from "../../chatMenuContext";
import AddChatModal from "../AddChatModal/AddChatModal";
import "./chatMenu.css";

const ChatMenu = () => {
    const { currentView, setCurrentView } = useView();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddChatClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleBackClick = () => {
        setCurrentView('chats');
    };

    return (
        <div className="chats-box">
            {currentView === 'chats' && (
                <div className="chat-menu">
                    <div className="chat-menu-avatar">
                        <img src="/assets/avatar.avif" alt="chat-menu-avatar" />
                    </div>
                    <div className="chat-menu-info">
                        <h1>Chat Name</h1>
                        <p>Chat Message</p>
                    </div>
                    <div className="add-chat" onClick={handleAddChatClick}>
                        <img src="/assets/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="add-chat" />
                    </div>
                </div>
            )}

            {currentView === 'profile' && (
                <div className="user-info">
                    <img src="/assets/arrow_back_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="back" onClick={handleBackClick} />
                    <img src="/assets/avatar.avif" alt="user-avatar" />
                    <h2>User Name</h2>
                    <p>+380 XX XXX XX XX</p>
                    <p>username@email.com</p>
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