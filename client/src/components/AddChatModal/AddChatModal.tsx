import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './AddChatModal.css';
import {useDispatch} from "react-redux";
import { addChat } from "../../features/chatSlice"
import socket from '../../socket';

interface AddChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface User {
    id: number;
    username: string;
    avatar?: string;
}

interface SearchResponse {
    users: User[];
    count: number;
}

interface TokenPayload {
    id: number;
    username: string;
    phone: string;
}

const AddChatModal = ({ isOpen, onClose }: AddChatModalProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const ITEMS_PER_PAGE = 5;
    const dispatch = useDispatch();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);  

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery !== '') {
            fetchUsers(debouncedQuery, 1);
            setPage(1);
        }
    }, [debouncedQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query === '') {
            setSearchResults([]);
            setHasMore(true);
        }
    };

    const getUserIdFromToken = (): number | null => {
        const token = sessionStorage.getItem('token');
        if (!token) return null;
        
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    const fetchUsers = async (query: string, pageNumber: number) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:3001/chats/get-chats?query=${query}&page=${pageNumber}&limit=${ITEMS_PER_PAGE}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                    }
                }
            );

            const data: SearchResponse = await response.json();

            if (response.ok) {
                setSearchResults(prev => 
                    pageNumber === 1 ? data.users : [...prev, ...data.users]
                );
                setHasMore(data.users.length === ITEMS_PER_PAGE);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };


    const addChat = async (selectedUserId: number) => {
    
        const currentUserId = getUserIdFromToken();

    
        const body = {
            user_one: currentUserId,
            user_two: selectedUserId
        };
    
        try {
            const response = await fetch('http://localhost:3001/chats/add-chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(body)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                onClose(); 
            } else {
                console.error('Failed to create chat:', data.error);
            }

        } catch (error) {
            console.error('Error creating chat:', error);
        } 
    };



    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            await fetchUsers(debouncedQuery, nextPage);
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
                <div className="search-results" onScroll={handleScroll}>
                    {searchResults.map((user) => (
                        <div 
                            key={user.id} 
                            className="user-item"
                            onClick={() => addChat(user.id)}
                        >
                            <img 
                                src={user.avatar || "/assets/avatar.avif"} 
                                alt={user.username} 
                            />
                            <span>{user.username}</span>
                        </div>
                    ))}
                    {loading && <div className="loading">Loading...</div>}
                </div>
            </div>
        </div>
    );
};

export default AddChatModal;