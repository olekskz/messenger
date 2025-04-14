import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../features/chatSlice";
export const store = configureStore({
    reducer: {
        chats: chatReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;