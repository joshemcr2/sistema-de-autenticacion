import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
				</div>
				<Link to="/signup">
					<button
						type="button"
						className="btn btn-success singUpButton"
					>SignUp
					</button>
				</Link>
				<Link to="/login">
					<button
						type="button"
						className="btn btn-primary loginButton"
					>Login
					</button>
				</Link>
			</div>
		</nav>
	);
};
