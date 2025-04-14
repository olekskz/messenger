import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./RegisterPage.css";
import getUserIdFromToken from "../../utils/getUserIdFromToken";
import socket from "../../socket";

type InputState = {
    username: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const [input, setInput] = useState<InputState>({
        username: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(true)
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setInput(prevValue => ({
            ...prevValue,
            [name]: value
        }));

        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password') {
                setIsPasswordMatch(value === input.confirmPassword);
            } else {
                setIsPasswordMatch(value === input.password);
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userId = getUserIdFromToken()
        try {

            const response = await fetch('http://localhost:3001/auth/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const data = await response.json()

            if (response.ok) {
                sessionStorage.setItem('token', data.token)
                socket.emit("user-connected", userId);
                navigate('/avatar-paste')
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="register-container">
            <div className="register-form">
                <img src="/assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="login-icon" />
                <form onSubmit={handleSubmit}>
                    <input type="text" 
                        name="username"
                        placeholder="Username"
                        required 
                        onChange={handleChange}/>
                    <input type="phone"
                        name="phone"
                        placeholder="Phone"
                        required
                        onChange={handleChange} />
                    <input type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className={!isPasswordMatch ? 'password-mismatch' : ''}
                        onChange={handleChange} />
                    <input type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                        className={!isPasswordMatch ? 'password-mismatch' : ''}
                        onChange={handleChange} />
                    <button type="submit">Sign up</button>
                </form>
                <Link to="/">Already have an account? Sign in</Link>
            </div>
        </div>
    );
};

export default RegisterPage;