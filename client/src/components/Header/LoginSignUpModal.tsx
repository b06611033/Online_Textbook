import React from "react";
import { Modal, Button } from "semantic-ui-react";

type LoginSignUpModalProps = {
	action: "login" | "sign-up";
	open: boolean;
	onClose(): void;
};

const LoginSignUpModal: React.FC<LoginSignUpModalProps> = (props): JSX.Element => {
	return (
		<Modal
			closeIcon
			closeOnDimmerClick
			onClose={(event, data) => props.onClose()}
			open={props.open}
		>
			<Modal.Header>{props.action === "login" ? "Login with" : "Sign up with"}</Modal.Header>
			<Modal.Content>
				<Button
					color="red"
					content="Google"
					fluid
					icon="google"
					labelPosition="left"
					onClick={(event, data) => {
						window.location.replace("/api/v1/auth/google/login");
					}}
					size="medium"
				/>
			</Modal.Content>
		</Modal>
	);
};

export default LoginSignUpModal;
