import React, { useEffect } from "react";
import { useAction } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";

const UsersList: React.FC = () => {
  const { errors, loading, users } = useTypedSelector((state) => state.user);

  const { fetchUsers } = useAction();
  useEffect(() => {
    fetchUsers();
  }, []);

  if (errors) {
    return <div>{errors}</div>;
  }

  if (loading) {
    return <div>Loading the users!</div>;
  }
  console.log(users);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}> {user.name} </div>
      ))}
    </div>
  );
};

export default UsersList;
