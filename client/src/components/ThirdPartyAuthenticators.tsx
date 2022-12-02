//import React from "react";
import { Button } from "semantic-ui-react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import React, { useState, useEffect, useContext } from "react";
import { ApplicationContext } from "../context";
import { User } from "../entities";
import { useHistory } from "react-router-dom";

type ThirdPartyAuthenticatorsProps = {
  action: "login" | "sign-up";
};

const ThirdPartyAuthenticators: React.FC<ThirdPartyAuthenticatorsProps> = (
  props
): JSX.Element => {
  const ctx = useContext(ApplicationContext);
  const handleLogin = (res: any) => {
    console.log("success:", res);
    // fetch("${process.env.REACT_APP_SERVER_DOMAIN}/auth/google").then((data) => {
    //   console.log(data.json());
    // });
    const user: User = {
      id: res.profileObj.googleId,
      name: res.profileObj.name,
      email: res.profileObj.email,
    };
    ctx.setUser!(user);
  };
  return (
    // <GoogleLogin
    //   clientId="887279930655-lb7apr295ikt6fua81mg50p8il4tue1k.apps.googleusercontent.com"
    //   render={(renderProps) => (
    //     <Button
    //       onClick={renderProps.onClick}
    //       disabled={renderProps.disabled}
    //       color="red"
    //       content="Google"
    //       fluid
    //       icon="google"
    //       size="medium"
    //     />
    //   )}
    //   buttonText="Sign in with Google"
    //   onSuccess={handleLogin}
    //   cookiePolicy={"single_host_origin"}
    //   isSignedIn={false}
    // />
    <Button
      color="red"
      content="Google"
      fluid
      icon="google"
      onClick={(event, data) =>
        window.location.replace(
          `${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`
        )
      }
      onSuccess={handleLogin}
      size="medium"
    />
  );
};

export default ThirdPartyAuthenticators;
