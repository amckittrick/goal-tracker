import { useState } from 'react';
import { googleLogout } from '@react-oauth/google';

import { UserObject } from './App.tsx';
import ModalGeneralAdmin from './ModalGeneralAdmin.tsx';

export default function Header(
  { user, updateUser}: { user: UserObject | null, updateUser: ( user: UserObject | null) => void}
) {
    const [modalGeneralAdminIsOpen, setModalGeneralAdminIsOpen] = useState(false);
  
    const openModalGeneralAdmin = () => {
      setModalGeneralAdminIsOpen(true);
    };
  
    const closeModalGeneralAdmin = () => {
      setModalGeneralAdminIsOpen(false);
    };

    const logout = () => {
      googleLogout();
      updateUser(null);
    };
  
    const today = new Date();

    return (
      <nav className="navbar navbar-expand-lg border-bottom border-primary">
        <div className="container-fluid">
          <div className="navbar-nav flex-row">
            {
              user === null ?
              (<a className="navbar-brand p-0 mx-1 text-primary">{today.toDateString()}</a>) : 
              (<a className="navbar-brand p-0 mx-1 text-primary">{user.fullname} | {today.toDateString()}</a>)
            }
          </div>
          <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
            <i className="btn bi bi-gear mx-1 text-primary" onClick={openModalGeneralAdmin}></i>
          </ul>
          {
            user && (<button className="btn text-primary" onClick={logout}>Logout</button>)
          }
        </div>
        {modalGeneralAdminIsOpen && <ModalGeneralAdmin closeModal={closeModalGeneralAdmin}></ModalGeneralAdmin>}
      </nav>
    );
}
