import { useState } from 'react';
import { useQuery } from '@apollo/client';

import Header from './Header.tsx';
import User from './User.tsx';
import UserSelection from './UserSelection.tsx';
import { gqlGetUsers } from './GQLQueries.tsx';

import "bootstrap-icons/font/bootstrap-icons.css";

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

  const initialUsername = getCookie("username");

  const [currentUsername, setCurrentUsername] = useState(initialUsername === null ? '' : initialUsername);

  const updateUser = (username: string) => {
    setCookie("username", username, 1);
    setCurrentUsername(username);
  };

  const { loading, error, data } = useQuery(gqlGetUsers);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  let usernames: string[] = [];

  if (data) {
    usernames = data.users.map( user => user.name );
  }

  return (
    <div>
      <Header
        username={currentUsername}
        updateUser={updateUser}>
      </Header>
      {currentUsername === '' ?
        (<UserSelection usernames={usernames} updateUser={updateUser}></UserSelection>) : 
        (<User username={currentUsername}></User>)
      }
    </div>
  )
}

export default App
