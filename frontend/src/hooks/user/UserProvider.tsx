import * as React from 'react';
import UserContext, { UserData } from './UserContext';
import { request } from '../authentication/authentication';

interface UserProviderProps {
 children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
 const [user, setUser] = React.useState<UserData | null>(null);

 const updateUser = (userData: UserData) => {
   setUser(userData);
 };

 React.useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      const response = await request('api/user/details/');
      if (response.ok) {
        const data = await response.json();
        const { first_name, last_name, email, id } = data;
        setUser({ firstName: first_name, lastName: last_name, id: id, email });
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (user === null) {
    fetchUserDetails();
  }
}, [user]);

 return (
   <UserContext.Provider value={{ user, updateUser }}>
     {children}
   </UserContext.Provider>
 );
};

export default UserProvider;
