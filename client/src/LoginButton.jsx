import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { isAuthenticated, error, loginWithRedirect } = useAuth0();

  console.log(error);

  return !isAuthenticated && <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;