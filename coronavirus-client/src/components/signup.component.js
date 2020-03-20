import React, { Component } from "react";
import CryptoJS from "crypto-js";
import axios from "axios";
import FormValidators from "./validate";
const validateSignUpForm = FormValidators.validateSignUpForm;

export default class SignUp extends Component {
	constructor(props) {
		super(props);

		this.state = {
			errors: {},
			success: false,
			agreedToPolicy: false,
			user: {
				name: "",
				email: "",
				password: "",
				pwconfirm: ""
			}
		};

		this.onChange = this.onChange.bind(this);
		this.validateForm = this.validateForm.bind(this);
		this.submitSignup = this.submitSignup.bind(this);
		this.errorList = this.errorList.bind(this);
	}

	onChange(event) {
		this.setState({ success: false });
		const field = event.target.name;
		const user = this.state.user;
		user[field] = event.target.value;
		this.setState({ user });
	}

	submitSignup(user) {
		var params = {
			name: user.name,
			email: user.email,
			// Salt the password with the user email
			hashedPassword: CryptoJS.SHA256(user.password + user.email).toString(CryptoJS.enc.Base64)
		};
		axios
			.post(`${process.env.REACT_APP_SERVER_DOMAIN}/api/authentication/local/sign-up`, params)
			.then(res => {
				this.setState({ success: true });
				window.location.replace(res.request.responseURL);
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
			_errorList.push(<li key={key}>{this.state.errors[key]}</li>);
		});
		return _errorList;
	}

	validateForm(event) {
		event.preventDefault();
		let payload = validateSignUpForm(this.state.user);
		if (payload.success) {
			this.setState({
				errors: {}
			});
			let user = {
				name: this.state.user.name,
				email: this.state.user.email,
				password: this.state.user.password
			};
			this.submitSignup(user);
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
					<h3>Sign Up</h3>
					{Object.keys(this.state.errors) !== 0 && (
						<ul style={{ color: "red" }}>{this.errorList()}</ul>
					)}
					{this.state.success && <p style={{ color: "green", textAlign: "center" }}>Success!</p>}

					<div className="form-group">
						<label htmlFor="name">Full Name</label>
						<input
							name="name"
							type="text"
							className="form-control"
							placeholder="Full name"
							value={this.state.user.name}
							onChange={this.onChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input
							name="email"
							type="email"
							className="form-control"
							placeholder="Enter email"
							value={this.state.user.email}
							onChange={this.onChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							name="password"
							type="password"
							className="form-control"
							placeholder="Enter password"
							value={this.state.user.password}
							onChange={this.onChange}
						/>
					</div>

					<div className="form-group">
						<label htmlFor="pwconfirm">Confirm Password</label>
						<input
							name="pwconfirm"
							type="password"
							className="form-control"
							placeholder="Re-enter password"
							value={this.state.user.pwconfirm}
							onChange={this.onChange}
						/>
					</div>
					<div className="form-group">
						<div className="custom-control custom-checkbox">
							<input
								type="checkbox"
								className="custom-control-input"
								id="customCheck1"
								checked={this.state.agreedToPolicy}
								onChange={event => this.setState({ agreedToPolicy: event.target.checked })}
								name="agreed-to-policy"
							/>
							<label className="custom-control-label" htmlFor="customCheck1">
								I agree to the <a href="/legal">Terms of Service</a>,{" "}
								<a href="/legal">Privacy Policy</a>,{" "}
								<a href="/legal">Cookie Policy</a>.
							</label>
						</div>
					</div>

					<button
						disabled={!this.state.agreedToPolicy && Object.keys(this.state.errors) !== 0}
						label="submit"
						type="submit"
						className="btn btn-primary btn-block"
					>
						Sign Up
					</button>
					<p className="forgot-password text-right">
						Already registered? <a href="/login">Login</a>
					</p>
				</form>
			</div>
		);
	}
}
