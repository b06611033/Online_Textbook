import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import ForgotPassword from "./components/forgotpassword.component";
import SignUp from "./components/signup.component";
import Legal from "./components/legal.component";
import NotFound from "./components/notfound.component";
import Unauthorized from "./components/unauthorized.component";

function App() {
	return (
		<Router>
			<div className="App">
				<nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
					<Link className="navbar-brand" to={"/login"}>
						<span style={{ fontFamily: "Fira Sans", color: "green", fontWeight: "bold" }}>MY</span>
						<span style={{ fontFamily: "Fira Sans", color: "blue", fontWeight: "bold" }}>Math</span>
						<span style={{ fontFamily: "Fira Sans", color: "red", fontWeight: "bold" }}>Apps</span>
					</Link>
					<button
						className="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item">
								<Link className="nav-link" to={"/login"}>
									Login
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={"/sign-up"}>
									Sign up
								</Link>
							</li>
							<li className="nav-item">
								<Link className="nav-link" to={"/legal"}>
									Legal
								</Link>
							</li>
						</ul>
					</div>
				</nav>

				<div style={{ paddingTop: "100px", paddingBottom: "100px" }} className="auth-wrapper">
					<Switch>
						<Route exact path="/" component={SignUp} />
						<Route path="/login" component={Login} />
						<Route path="/sign-up" component={SignUp} />
						<Route path="/forgot-password" component={ForgotPassword} />
						<Route path="/legal" component={Legal} />
						<Route path="/notfound" component={NotFound} />
						<Route path="/unauthorized" component={Unauthorized} />
						<Route path="/*" component={NotFound} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
