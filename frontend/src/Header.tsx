import { useState } from 'react';
import { useQuery } from '@apollo/client';

import ModalGeneralAdmin from './ModalGeneralAdmin.tsx';
import { gqlGetUsers } from './GQLQueries.tsx';

export default function Header(
  { username, updateUser }: { username: string, updateUser: ( username: string) => void }
) {
    const [modalGeneralAdminIsOpen, setModalGeneralAdminIsOpen] = useState(false);
  
    const openModalGeneralAdmin = () => {
      setModalGeneralAdminIsOpen(true);
    };
  
    const closeModalGeneralAdmin = () => {
      setModalGeneralAdminIsOpen(false);
    };

    const handleChangeUserClick = (username: string) => {
      updateUser(username);
    };
    
    const { loading, error, data } = useQuery(gqlGetUsers);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
  
    const today = new Date();

    return (
      <nav className="navbar navbar-expand-lg bg-secondary">
        <div className="container-fluid">
          <div className="navbar-nav flex-row">
            <a className="navbar-brand p-0 mx-1">{username} | {today.toDateString()}</a>
          </div>
          <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
            <li className="nav-item dropdown mx-1">
              <a className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                User
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {
                  data?.users.map((user) =>
                    <li key={user.name}>
                      <a type="button" className="dropdown-item" onClick={() => handleChangeUserClick(user.name)}>{user.name}</a>
                    </li>
                )}
              </ul>
            </li>
            <i className="btn bi bi-gear mx-1" onClick={openModalGeneralAdmin}></i>
          </ul>
        </div>
        {modalGeneralAdminIsOpen && <ModalGeneralAdmin closeModal={closeModalGeneralAdmin}></ModalGeneralAdmin>}
      </nav>
    );
}
