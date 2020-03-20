import React, { Component } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import FormValidators from "./validate";
const validateLoginForm = FormValidators.validateLoginForm;

export default class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errors: {},
			user: {
				email: "",
				password: ""
			}
		};

		this.onChange = this.onChange.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.submitLogin = this.submitLogin.bind(this);
		this.errorList = this.errorList.bind(this);
	}

	onChange(event) {
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;
		this.setState({ user });
	}

	submitLogin(user) {
		var params = {
			email: user.email,
			// Salt the password with the user email
			hashedPassword: CryptoJS.SHA256(user.password + user.email).toString(CryptoJS.enc.Base64)
		};
		axios
			.post("http://localhost:8080/api/authentication/local/login", params)
			.then(res => {
				// axios
				// 	.get("http://localhost:8080/api/products/content/access")
				// 	.then(res => {
				window.location.replace(res.request.responseURL);
				// })
				// .catch(err => {
				// 	if (err.response) {
				// 		this.setState({ errors: { message: err.response.data.message } });
				// 	}
				// });
			})
			.catch(err => {
				if (err.response) {
					this.setState({ errors: { message: err.response.data.message } });
				}
			});
	}

	errorList() {
		let _errorList = [];
		Object.keys(this.state.errors).forEach(key => {
			_errorList.push(<li>{this.state.errors[key]}</li>);
		});
		return _errorList;
	}

	validateForm(event) {
		event.preventDefault();
		let payload = validateLoginForm(this.state.user);
		if (payload.success) {
			this.setState({
				errors: {}
			});
			let user = {
				email: this.state.user.email,
				password: this.state.user.password
			};
			this.submitLogin(user);
		} else {
			const errors = payload.errors;
			this.setState({
				errors
			});
		}
	}
	render() {
		return (
			<div className="auth-inner">
				<form onSubmit={this.validateForm} noValidate>
					<h3>Login</h3>
					{Object.keys(this.state.errors) !== 0 && (
						<ul style={{ color: "red" }}>{this.errorList()}</ul>
					)}

					<div className="form-group">
						<label>Email Address</label>
						<input
							type="email"
							name="email"
							value={this.state.user.email}
							onChange={this.onChange}
							className="form-control"
							placeholder="Enter email"
						/>
					</div>

					<div className="form-group">
						<label>Password</label>
						<input
							type="password"
							name="password"
							value={this.state.user.password}
							onChange={this.onChange}
							className="form-control"
							placeholder="Enter password"
						/>
					</div>

					<div className="form-group">
						<div className="custom-control custom-checkbox">
							<input type="checkbox" className="custom-control-input" id="customCheck1" />
							<label className="custom-control-label" htmlFor="customCheck1">
								Remember me
							</label>
						</div>
					</div>

					<button type="submit" className="btn btn-primary btn-block">
						Submit
					</button>
					<p className="forgot-password text-right">
						Forgot <a href="/forgot-password">password?</a>
					</p>
				</form>
			</div>
		);
	}
}
