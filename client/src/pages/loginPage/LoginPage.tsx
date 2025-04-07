import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import "./loginPage.css";

type InputTypes = {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [input, setInput] = useState<InputTypes>({
        username: "",
        password: ""
    })

    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const {name, value} = e.target;
            setInput(prevValue => ({
                ...prevValue,
                [name]: value
            }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:3001/auth/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(input)
            });

            const data = await response.json()

            if (response.ok) {
                sessionStorage.setItem('token', data.token)
                navigate('/main')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <img src="/assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="login-icon" />
                <input type="text" name="username" placeholder="Username" required onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
                <button type="submit">Sign in</button>
                <Link className="login-a" to="/register">Don't have an account? Register</Link>
            </form>
        </div>
    );
};

export default LoginPage;