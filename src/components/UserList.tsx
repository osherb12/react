import useUsers from '../hooks/useUsers';


const UserList = () => {
  const { data: users, error, isLoading } = useUsers();
  

  if (isLoading) return <p>{"Loading..."}</p>;
  if (error) return <p>{"Error: "}{error.message}</p>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.uid}>{user.displayName}</li>
      ))}
    </ul>
  );
};

export default UserList;
