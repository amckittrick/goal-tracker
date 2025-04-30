import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

import { UserObject } from "./App";

export default function Login({updateUser}: {updateUser: ( user: UserObject | null) => void }) {
  const responseMessage = (response: CredentialResponse) => {
    if (response.credential) {    
      fetch('api/tokensignin', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/x-www-form-urlencoded',
        },
        body: 'idtoken=' + response.credential,
      }).then(loginResponse => {
        if (!loginResponse.ok) {
          throw new Error(`Error on loging: ${loginResponse.status}`);
        }

        return loginResponse.json()
      }).then(loginResponseData => {
        if (response.credential) {
          updateUser({email: loginResponseData.email, fullname: loginResponseData.name, token: response.credential});
        }
      })
    }

  };

  const errorMessage = () => {};

  return (
    <div className="d-flex justify-content-center m-2">
      <GoogleLogin onSuccess={responseMessage} onError={errorMessage}></GoogleLogin>
    </div>
  );
}