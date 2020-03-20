import React, { Component } from "react";

export default class Unauthorized extends Component {
	render() {
		return (
			<div className="auth-inner">
				<div style={{ textAlign: "center" }}>
					<i class="fa fa-ban fa-5x"></i>
				</div>
				<h1 style={{ textAlign: "center", textWeight: "bold" }}>Unauthorized</h1>
				<hr />
				<div style={{ textAlign: "center" }}>
      You do not have access to view this page, make sure you are logged in or <a href="/sign-up">sign up</a> to view this page.
				</div>
			</div>
		);
	}
}
