import React from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";
const RegisterPage: React.FC = () => {
    return (
        <div className="register-container">
            <div className="register-form">
                <img src="/assets/groups_24dp_000000_FILL0_wght400_GRAD0_opsz24.png" alt="login-icon" />
                <form>
                    <input type="text" name="username" placeholder="Username" required />
                    <input type="phone" name="phone" placeholder="Phone" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <input type="password" name="password" placeholder="Confirm Password" required />
                    <button type="submit">Sign up</button>
                </form>
                <Link to="/login">Allready have an account? Sign in</Link>
            </div>
        </div>
    );
};

export default RegisterPage;