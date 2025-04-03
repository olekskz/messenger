import React, { useState } from 'react';
import './AddChatModal.css';

interface AddChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    id: string;
    username: string;
    avatar?: string;
}

const AddChatModal = ({ isOpen, onClose }: AddChatModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length >= 3) {
            // API call simulation
            // const response = await fetch(`/api/users/search?username=${query}`);
            // const data = await response.json();
            // setSearchResults(data);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>New Chat</h2>
                    <img 
                        src="/assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" 
                        alt="close" 
                        onClick={onClose}
                        className="close-button"
                    />
                </div>
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                <div className="search-results">
                    {searchResults.map((user) => (
                        <div key={user.id} className="user-item">
                            <img 
                                src={user.avatar || "/assets/avatar.avif"} 
                                alt={user.username} 
                            />
                            <span>{user.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddChatModal;