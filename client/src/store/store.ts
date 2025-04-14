import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
import userReducer from "../features/userSlice"
export const store = configureStore({
    reducer: {
        chats: chatReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;