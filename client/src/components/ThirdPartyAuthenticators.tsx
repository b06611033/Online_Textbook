import { Button } from "semantic-ui-react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import React, { useState, useEffect, useContext } from "react";
import { ApplicationContext } from "../context";
import { User } from "../entities";
import { useHistory } from "react-router-dom";
import axios from "axios";

type ThirdPartyAuthenticatorsProps = {
  action: "login" | "sign-up";
};

const ThirdPartyAuthenticators: React.FC<ThirdPartyAuthenticatorsProps> = (
  props
): JSX.Element => {
  //const [message, setMessage] = useState("");
  const handleLogin = async () => {
    const response = await axios
      .get(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`, {
        headers: { "Access-Control-Allow-Origin": "*" },
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

    // localStorage.setItem("user", JSON.stringify(response.data));
    // window.alert("登入成功。您現在將被重新導向到個人資料頁面。");
    // setCurrentUser(AuthService.getCurrentUser());
    // nagivate("/profile");
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

// const ThirdPartyAuthenticators: React.FC<ThirdPartyAuthenticatorsProps> = (
//   props
// ): JSX.Element => {
//   return (
//     <Button
//       color="red"
//       content="Google"
//       fluid
//       icon="google"
//       onClick={(event, data) =>
//         window.location.replace(
//           `${process.env.REACT_APP_SERVER_DOMAIN}/auth/google`
//         )
//       }
//       size="medium"
//     />
//   );
// };

export default ThirdPartyAuthenticators;
