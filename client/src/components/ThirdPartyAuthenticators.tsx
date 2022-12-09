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
  const history = useHistory();
  const ctx = useContext(ApplicationContext);
  const w_width = 550;
  const w_height = 500;
  const x = (screen.width - 30 - w_width) / 2;
  const y = (screen.height - 10 - w_height) / 2;
  const w_config =
    "location=1,status=1,scrollbars=1," +
    "width=" +
    w_width +
    ",height=" +
    w_height +
    ",top=" +
    y +
    ",left=" +
    x;

  const handleLogin = () => {
    window.open(
      `${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`, // call the backend google login API
      "mywindow",
      w_config
    );

    const listener = window.addEventListener("message", (message) => {
      //console.log(message.data);
      localStorage.setItem("token", JSON.stringify(message.data.token));

      const currentUser = {
        id: message.data.user.googleID,
        name: message.data.user.name,
        email: message.data.user.email,
      };

      ctx.setUser!(currentUser as User);
      history.push("/");
    });
  };

  return (
    <Button
      color="red"
      content="Google"
      fluid
      icon="google"
      onClick={handleLogin}
      size="medium"
    />
  );
};

export default ThirdPartyAuthenticators;
