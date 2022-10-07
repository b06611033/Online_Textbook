import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class ForgotPassword extends Component {
	render() {
		return (
			<div className="auth-inner">
				<div style={{ textAlign: "center" }}>
					<i class="fa fa-key fa-5x"></i>
				</div>
				<h1 style={{ textAlign: "center", fontSize: "38px" }}>Recover password</h1>
				<hr />
				<div style={{ textAlign: "center" }}>
					To request your password to be reset, please send an email to{" "}
					<a href="mailto:yasskin@gmail.com">yasskin@gmail.com</a> from the email account associated
					with{"  "}
					<Link className="navbar-brand" to={"/login"}>
						<span
							style={{
								fontFamily: "Fira Sans",
								color: "green",
								fontWeight: "bold",
								fontSize: "15px"
							}}
						>
							MY
						</span>
						<span
							style={{
								fontFamily: "Fira Sans",
								color: "blue",
								fontWeight: "bold",
								fontSize: "15px"
							}}
						>
							Math
						</span>
						<span
							style={{
								fontFamily: "Fira Sans",
								color: "red",
								fontWeight: "bold",
								fontSize: "15px"
							}}
						>
							Apps
						</span>
					</Link>
				</div>
			</div>
		);
	}
}
