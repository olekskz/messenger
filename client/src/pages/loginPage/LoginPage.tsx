import React from "react";
import { Link } from "react-router-dom";
import "./loginPage.css";

const LoginPage: React.FC = () => {
    return (
        <div className="login-container">
            <form className="login-form">
                <img src="/assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="login-icon" />
                <input type="text" name="username" placeholder="Username" required />
                <input type="password" name="password" placeholder="Password" required />
                <button type="submit">Sign in</button>
                <Link className="login-a" to="/register">Don't have an account? Register</Link>
            </form>
        </div>
    );
};

export default LoginPage;