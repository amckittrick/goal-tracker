import { useState } from 'react';

import Header from './Header.tsx';
import User from './User.tsx';
import Login from './Login.tsx';

import "bootstrap-icons/font/bootstrap-icons.css";

import { setCookie, getCookie, deleteCookie } from './main.tsx';

export interface UserObject {
  email: string,
  fullname: string,
  token: string,
}

function App() {
  const initialUserEmail = getCookie("userEmail");
  const initialUserFullname = getCookie("userFullname");
  const initialToken = getCookie("userToken");

  const initialUser = initialUserEmail && initialUserFullname && initialToken ? { email: initialUserEmail, fullname: initialUserFullname, token: initialToken} : null;

  const [currentUser, setcurrentUser] = useState(initialUser);

  const updateUser = (user: UserObject | null) => {
    if (user === null) {
      deleteCookie("userEmail");
      deleteCookie("userFullname");
      deleteCookie("userToken");
    } else {
      setCookie("userEmail", user.email, 1);
      setCookie("userFullname", user.fullname, 1);
      setCookie("userToken", user.token, 1);
    }
    setcurrentUser(user);
  };

  return (
    <div className="bg-dark">
      <Header user={currentUser} updateUser={updateUser}>
      </Header>
      {currentUser === null ?
        (<Login updateUser={updateUser}></Login>) : 
        (<User></User>)
      }
    </div>
  )
}

export default App
