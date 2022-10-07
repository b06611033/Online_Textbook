import React, { Component } from "react";

export default class NotFound extends Component {
	render() {
		return (
			<div className="auth-inner">
				<div style={{ textAlign: "center" }}>
					<i class="fa fa-exclamation fa-5x"></i>
				</div>
				<h1 style={{ textAlign: "center", textWeight: "bold" }}>Page not found</h1>
				<hr />
				<div style={{ textAlign: "center" }}>
					We're sorry, the page you requested was not found. Please make sure the URL you entered is
					correct.
				</div>
			</div>
		);
	}
}
