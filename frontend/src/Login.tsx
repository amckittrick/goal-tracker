import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { UserObject } from "./App";

interface JwtPayload {
  email: string;
  name: string;
}

export default function Login({updateUser}: {updateUser: ( user: UserObject | null) => void }) {
  const responseMessage = (response: CredentialResponse) => {
    if (response.credential) {
      const decoded = jwtDecode(response.credential) as JwtPayload;
      console.log(decoded);
      updateUser({email: decoded.email, fullname: decoded.name})
    }

  };

  const errorMessage = () => {
  };

  return (
    <div className="d-flex justify-content-center m-2">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage}></GoogleLogin>
    </div>
);
}