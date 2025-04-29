import { googleLogout } from '@react-oauth/google';

import { UserObject } from './App.tsx';

export default function Header(
  { user, updateUser}: { user: UserObject | null, updateUser: ( user: UserObject | null) => void}
) {
    const logout = () => {
      googleLogout();
      updateUser(null);
    };
  
    const today = new Date();

    return (
      <nav className="navbar navbar-expand-lg border-bottom border-primary">
        <div className="container-fluid">
          <div className="navbar-nav flex-row">
            <a className="navbar-brand p-0 mx-1 text-primary">{today.toDateString()}</a>
          </div>
          {
            user && (<button className="btn text-primary" onClick={logout}>Logout</button>)
          }
        </div>
      </nav>
    );
}
