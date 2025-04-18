import { useState } from 'react';

import Encouragement from './Encouragement.tsx';
import Header from './Header.tsx';
import User from './User.tsx';
import Login from './Login.tsx';

import "bootstrap-icons/font/bootstrap-icons.css";

export interface UserObject {
  email: string,
  fullname: string,
}

function App() {
  const setCookie = (name: string, value: string, days: number) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`
  };

  const getCookie = (name: string) => {
    const cookies = document.cookie.split("; ").find((row) => row.startsWith(`${name}`));
    return cookies ? cookies.split("=")[1] : null;
  };

  const deleteCookie = (name: string) => {
    if (getCookie(name)) {
      document.cookie = `${name}=null; expires=Thu, 01 Jan 1970 00:0:00 UTC; path=/`
    }
  };

  const initialUserEmail = getCookie("userEmail");
  const initialUserFullname = getCookie("userFullname");

  const initialUser = initialUserEmail && initialUserFullname ? { email: initialUserEmail, fullname: initialUserFullname } : null;

  const [currentUser, setcurrentUser] = useState(initialUser);

  const updateUser = (user: UserObject | null) => {
    if (user === null) {
      deleteCookie("userEmail");
      deleteCookie("userFullname");
    } else {
      setCookie("userEmail", user.email, 1);
      setCookie("userFullname", user.fullname, 1);
    }
    setcurrentUser(user);
  };

  return (
    <div className="bg-dark">
      <Header user={currentUser} updateUser={updateUser}>
      </Header>
      {currentUser === null ?
        (<Login updateUser={updateUser}></Login>) : 
        (<User user={currentUser}></User>)
      }
      <Encouragement></Encouragement>
    </div>
  )
}

export default App
