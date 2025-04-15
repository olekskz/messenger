import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
    id: number;
    chat_id: number;
    sender_id: number;
    content: string;
    created_at: string;
}

interface MessageState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

const initialState: MessageState = {
    messages: [],
    loading: false,
    error: null,
};

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
            state.loading = false;
            state.error = null;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const exists = state.messages.some(msg => msg.id === action.payload.id);
            if (!exists) {
                state.messages.push(action.payload); 
            }
        },
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setMessages, addMessage, setLoading, setError } = messageSlice.actions;
export default messageSlice.reducer;