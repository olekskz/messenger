import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    id: number;
    username: string;
    phone: string;
}

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

export default getUserIdFromToken;