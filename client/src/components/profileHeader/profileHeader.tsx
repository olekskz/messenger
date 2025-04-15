import React, { useState } from "react";
import "./profileHeader.css";
import { useView } from "../../hooks/chatMenuContext";
import { useSelector } from "react-redux";


const ProfileHeader = () => {
    const { setCurrentView } = useView();
    const [search, setSearch] = useState<string>("");
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [showProfile, setShowProfile] = useState<boolean>(false);
    const userProfile = useSelector((state: any) => state.user.profile);
    
    const handleProfileClick = () => {
        setShowProfile(!showProfile);
        setCurrentView('profile');
    }
    
    const handleSearchClick = () => {
        setShowSearch(!showSearch);
        setCurrentView('search');
    }

    const handleCloseSearch = () => {
        setCurrentView('chats');
        setShowSearch(!showSearch);
        setSearch("");
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    
    return (
        <div className="profile-box">
            {!showSearch ? (
                <>
                    <img src={userProfile?.avatar || "/assets/default-avatar.png"} alt="profile-avatar" onClick={handleProfileClick} /> 
                    <img 
                        src="/assets/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" 
                        alt="search-chat" 
                        onClick={handleSearchClick}
                    /> 
                </>
            ) : (
                <div className="search-chat">
                    <img 
                        src="/assets/close_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" 
                        alt="close-chat"
                        onClick={handleCloseSearch} 
                    />
                    <input 
                        type="text" 
                        onChange={handleSearchChange} 
                        placeholder="Search"
                        value={search}
                    />
                    <img 
                        src="/assets/search_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" 
                        alt="search-chat" 
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;




