import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";

function App() {
	return (
		<Router>
			<div className="App">
				<nav className="navbar navbar-expand-lg navbar-light fixed-top">
					<div className="container">
						<Link className="navbar-brand" to={"/sign-in"}>
							<span style={{ color: "green", "font-weight": "bold" }}>MY</span>
							<span style={{ color: "blue", "font-weight": "bold" }}>Math</span>
							<span style={{ color: "red", "font-weight": "bold" }}>Apps</span>
						</Link>
						<div class="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav">
								<li className="nav-item">
									<Link className="nav-link" to={"/sign-in"}>
										Login
									</Link>
								</li>
								<li className="nav-item">
									<Link className="nav-link" to={"/sign-up"}>
										Sign up
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<div className="auth-wrapper">
					<div className="auth-inner">
						<Switch>
							<Route exact path="/" component={Login} />
							<Route path="/sign-in" component={Login} />
							<Route path="/sign-up" component={SignUp} />
						</Switch>
					</div>
				</div>
			</div>
		</Router>
	);
}

export default App;
