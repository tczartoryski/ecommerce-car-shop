import React, { createContext } from 'react';

export interface UserData {
 firstName: string;
 lastName: string;
 email: string;
 id: number;
}

interface UserContextData {
 user: UserData | null;
 updateUser: (userData: UserData) => void;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

export default UserContext;
