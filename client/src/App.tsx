import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import useSWR from "swr";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { ApplicationContext } from "./context/application.context";
import Header from "./components/Header";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MYMACalc1 from "./pages/MYMACalc1";
import MYMACalc3 from "./pages/MYMACalc3";
import MYMACalc2 from "./pages/MYMACalc2";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import User from "./entities/user";
import Subscription from "./entities/subscription";
import Home from "./pages/Home";

const App: React.FC = (): JSX.Element => {
	const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
	const [user, setUser] = useState<User | undefined>();
	const [cart, setCart] = useState<Subscription[]>([]);
	const { data, error } = useSWR<User, Error>("/api/authentication/jwt/login", (url) =>
		fetch(url, { method: "GET", headers: { Accept: "application/json" } }).then((res) => res.json())
	);

	useEffect(() => {
		if (!error && !data) {
			setUser(data);
		}
	}, [data, error]);

	return (
		<BrowserRouter>
			<ApplicationContext.Provider value={{ user, setUser, cart, setCart }}>
				<div className="App" style={{ display: "flex", flexDirection: "column" }}>
					<Header />
					<main style={{ flexGrow: 1 }}>
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/about">
								<About />
							</Route>
							<Route exact path="/products">
								<Products />
							</Route>
							<Route exact path="/products/MYMACalc1">
								<MYMACalc1 />
							</Route>
							<Route exact path="/products/MYMACalc2">
								<MYMACalc2 />
							</Route>
							<Route exact path="/products/MYMACalc3">
								<MYMACalc3 />
							</Route>
							<Route exact path="/checkout">
								<Checkout />
							</Route>
							<Route exact path="/contact">
								<Contact />
							</Route>
						</Switch>
					</main>
				</div>
			</ApplicationContext.Provider>
		</BrowserRouter>
	);
};

export default App;
