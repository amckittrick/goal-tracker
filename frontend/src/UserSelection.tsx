export default function Goal(
  {usernames, updateUser}:{ usernames: string[], updateUser: ( username: string) => void }
) {

  const handleChangeUserClick = (username: string) => {
      updateUser(username);
      };

  return (
    <div className="d-flex justify-content-center text-primary">
      <h3 className="mx-2">Pick a User</h3>
      <div>
        {
          usernames.map((username) =>
            <button type="button" className="p-1 m-1 btn btn-secondary" onClick={() => handleChangeUserClick(username)}>
              {username}
            </button>
        )}
      </div>
    </div>
);
}