import React, { useState } from 'react';
import UserContext, { UserData } from './UserContext';

interface UserProviderProps {
 children: React.ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
 const [user, setUser] = useState<UserData | null>(null);

 const updateUser = (userData: UserData) => {
   setUser(userData);
 };

 return (
   <UserContext.Provider value={{ user, updateUser }}>
     {children}
   </UserContext.Provider>
 );
};

export default UserProvider;
