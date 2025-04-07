import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface SecureRouteProps {
    children: ReactNode;
}

const SecureRoute = ({ children }: SecureRouteProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    if (!children) {
        return null;
    }

    return children;
};

export default SecureRoute;