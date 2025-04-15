import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: number;
    username: string;
    avatar: string | null;
}

interface Chat {
    id: number;
    user_one: number;
    user_two: number;
    userOne: User;
    userTwo: User;
}

interface ChatState {
    chats: Chat[];
    loading: boolean;
    error: string | null;
    selectedChat: Chat | null;
}

const initialState: ChatState = {
    chats: [],
    loading: false,
    error: null,
    selectedChat: null
};

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSelectedChat: (state, action: PayloadAction<Chat>) => {
            state.selectedChat = action.payload;

            const exists = state.chats.some(chat => chat.id === action.payload.id);
            if (exists) {
                state.chats = state.chats.map(chat =>
                    chat.id === action.payload.id ? action.payload : chat
                );
            } else {
                state.chats.push(action.payload);
            }

            state.loading = false;
            state.error = null;
        },
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.unshift(action.payload);
            state.error = null;
        },
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { setChats, addChat, setLoading, setError, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
