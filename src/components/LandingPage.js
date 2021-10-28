import React from "react";

// LANDINGPAGE WITH SAVE BUTTON props.children inside
const LandingPage = (props) => {
    // if not logged in, display LandingPage
    if (!props.token) {
        return (
            <div className="LandingPage">
                <div className="landingPageMessage">
                        {props.landingPageMessage}
                </div>
                <form>
                    <label>Email</label>
                    <input className="email" type="email" defaultValue="joki20@student.bth.se"></input>

                    <label>Password</label>
                    <input className="password" defaultValue="abc123"></input>
                    <div>
                    <input
                            type="submit"
                            className="login"
                            value="Login"
                            onClick={props.handleLogin}
                        />
                        <input
                            type="submit"
                            className="register"
                            value="Register"
                            onClick={props.handleRegister} />
                    </div>
                </form>
            </div>
        )
    } else {
        return null;
    }
};

export default LandingPage;
