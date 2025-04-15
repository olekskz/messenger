import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
import userReducer from "../features/userSlice"
import messageReducer from "../features/messageSlice"

export const store = configureStore({
    reducer: {
        chats: chatReducer,
        user: userReducer,
        messages: messageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;