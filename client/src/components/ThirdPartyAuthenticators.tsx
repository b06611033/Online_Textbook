//import React from "react";
import { Button } from "semantic-ui-react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import React, { useState, useEffect } from "react";

type ThirdPartyAuthenticatorsProps = {
	action: "login" | "sign-up";
};

const clientId = "887279930655-lb7apr295ikt6fua81mg50p8il4tue1k.apps.googleusercontent.com";

//useEffect(() => {
	const initClient = () => {
		  gapi.client.init({
		  clientId: clientId,
		  scope: ''
		});
	 };
	 gapi.load('client:auth2', initClient);
 //});

const ThirdPartyAuthenticators: React.FC<ThirdPartyAuthenticatorsProps> = (props): JSX.Element => {
	const onSuccess = (res: any) => {
		console.log("success:", res);
	};
	const onFailure = (err: any) => {
		console.log("failed:", err);
	};
	return (
		<GoogleLogin
			clientId={clientId}
			render={(renderProps) => (
				<Button
					onClick={renderProps.onClick}
					disabled={renderProps.disabled}
					color="red"
					content="Google"
					fluid
					icon="google"
					size="medium"
				/>
			)}
			buttonText="Sign in with Google"
			onSuccess={onSuccess}
			onFailure={onFailure}
			cookiePolicy={"single_host_origin"}
			isSignedIn={true}
		/>
	);
	/*return (
		<Button
			color="red"
			content="Google"
			fluid
			icon="google"
			onClick={(event, data) =>
				window.location.replace(
					`${process.env.REACT_APP_MYMA_SERVER}/api/authentication/google/login`
				)
			}
			size="medium"
		/>
	);*/
};

export default ThirdPartyAuthenticators;
