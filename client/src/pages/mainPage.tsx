import React from "react";
import ProfileHeader from "../components/profileHeader/profileHeader";
import ChatMenu from "../components/chatMenu/chatMenu";
import { ViewProvider } from "../hooks/chatMenuContext";
import Chat from "../components/chat/chat";


const MainPage = () => {
    return (
        <ViewProvider>
            <div className="main-container">
                <div className="chats-container">
                    <ProfileHeader />
                    <ChatMenu />
                </div>
                <Chat />
            </div>
        </ViewProvider>
    );
};

export default MainPage;