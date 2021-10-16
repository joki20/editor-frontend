import React from "react";

// SIGNUP AND LOGIN
const AuthForm = (props) => {
    // if token exists, then user is logged in
    if (props.token) {
        return (
            <div>
                <div>{props.currentUser} is logged in</div>
                <button onClick={props.logout} >Log out</button>
            </div>

        )
    } else {
        return (
            <div className="AuthForm">
                <form>
                    <label>Email</label>
                    <input className="email" type="email" defaultValue="joki20@student.bth.se"></input>

                    <label>Password</label>
                    <input className="password" defaultValue="abc123"></input>
                    <input
                        type="submit"
                        className="register"
                        value="Register"
                        onClick={props.handleRegister} />
                    <input
                        type="submit"
                        className="login"
                        value="Login"
                        onClick={props.handleLogin}
                    />
                </form>
            </div>
        )
    }
};

export default AuthForm;