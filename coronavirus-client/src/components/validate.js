const validator = require("validator");

const validateSignUpForm = payload => {
	const errors = {};
	let message = "";
	let isFormValid = true;

	if (!payload || typeof payload.name !== "string" || payload.name.trim().length === 0) {
		isFormValid = false;
		errors.username = "Please provide a name";
	}

	if (!payload || typeof payload.email !== "string" || !validator.isEmail(payload.email)) {
		isFormValid = false;
		errors.email = "Please provide a correct email address";
	}

	if (
		!payload ||
		typeof payload.password !== "string" ||
		/\s/.test(payload.password) ||
		payload.password.length === 0
	) {
		isFormValid = false;
		if (/\s/.test(payload.password)) {
			errors.password = "Password cannot contain whitespace";
		} else if (payload.password.length === 0) {
			errors.password = "Password cannot be empty";
		}
	}

	if (!payload || payload.pwconfirm !== payload.password) {
		isFormValid = false;
		errors.pwconfirm = "Password confirmation doesn't match";
	}

	if (!isFormValid) {
		message = "Check the form for errors";
	}

	return {
		success: isFormValid,
		message,
		errors
	};
};

const validateLoginForm = payload => {
	const errors = {};
	let message = "";
	let isFormValid = true;

	if (!payload || typeof payload.email !== "string" || !validator.isEmail(payload.email)) {
		isFormValid = false;
		errors.email = "Please provide a correct email address";
	}

	if (!payload || typeof payload.password !== "string" || payload.password.length === 0) {
		isFormValid = false;
		errors.password = "Please provide a non-empty password";
	}

	if (!isFormValid) {
		message = "Check the form for errors";
	}

	return {
		success: isFormValid,
		message,
		errors
	};
};

module.exports = {
	validateLoginForm: validateLoginForm,
	validateSignUpForm: validateSignUpForm
};
