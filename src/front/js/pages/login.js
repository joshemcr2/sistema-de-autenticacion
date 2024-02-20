import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";


export const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const Navigate = useNavigate();
    const { store, actions } = useContext(Context);

    const handleLogin = (e) => {
        e.preventDefault();
        actions.login(email, password);
    };

    return (
        <div className="container pt-3">
            {(store.token && store.token !== "" && store.token !== undefined) ?
                <div><Link to="/private">Go Private</Link></div>
                :
                <div className="Card mx-auto" style={{ width: "25rem" }}>
                    <h3 className="text-center">Login</h3>
                    <input
                        type="email"
                        value={email}
                        className="form-control mb-3"
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <input
                        type="password"
                        value={password}
                        className="form-control mb-3"
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
            }
        </div>
    )
}