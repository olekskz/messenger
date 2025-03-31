import React from "react";
import ProfileHeader from "../components/profileHeader/profileHeader";
import ChatMenu from "../components/chatMenu/chatMenu";
import { ViewProvider } from "../chatMenuContext";

const MainPage = () => {
    return (
        <ViewProvider>
            <div>
                <div className="chats-container">
                    <ProfileHeader />
                    <ChatMenu />
                </div>
            </div>
        </ViewProvider>
    );
};

export default MainPage;