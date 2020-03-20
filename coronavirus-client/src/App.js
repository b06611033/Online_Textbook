import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Legal from "./components/legal.component";

function App() {
	return (
		<Router>
			<div className="App">
				<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
					<Link className="navbar-brand" to={"/login"}>
						<span style={{ fontFamily: "Fira Sans", color: "green", fontWeight: "bold" }}>MY</span>
						<span style={{ fontFamily: "Fira Sans", color: "blue", fontWeight: "bold" }}>Math</span>
						<span style={{ fontFamily: "Fira Sans", color: "red", fontWeight: "bold" }}>Apps</span>
					</Link>
					<button
						class="navbar-toggler"
						type="button"
						data-toggle="collapse"
						data-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span class="navbar-toggler-icon"></span>
					</button>
					<div class="collapse navbar-collapse" id="navbarNav">
						<ul class="navbar-nav">
							<li class="nav-item active">
								<Link className="nav-link" to={"/login"}>
									Login
								</Link>
							</li>
							<li class="nav-item">
								<Link className="nav-link" to={"/sign-up"}>
									Sign up
								</Link>
							</li>
						</ul>
					</div>
				</nav>

				<div style={{ paddingTop: "100px", paddingBottom: "100px" }} className="auth-wrapper">
					<Switch>
						<Route exact path="/" component={Login} />
						<Route path="/login" component={Login} />
						<Route path="/sign-up" component={SignUp} />
						<Route path="/legal" component={Legal} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
