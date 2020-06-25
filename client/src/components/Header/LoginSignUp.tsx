import React, { useState, useCallback } from "react";
import { Menu, Button } from "semantic-ui-react";

type LoginSignUpModalProps = {
	onClick(a: "login" | "sign-up"): void;
};

const LoginSignUp: React.FC<LoginSignUpModalProps> = (props): JSX.Element => {
	return (
		<Menu.Item position="right">
			<Button.Group>
				<Button onClick={(event, data) => props.onClick("sign-up")} primary>
					Sign Up
				</Button>
				<Button.Or />
				<Button onClick={(event, data) => props.onClick("login")}>Login</Button>
			</Button.Group>
		</Menu.Item>
	);
};

export default LoginSignUp;
