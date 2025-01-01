import { useContext } from "react";
import UserContext from "../user/UserContext";

export interface LoginData {
    access: string;
    refresh: string;
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
  }
  
  const useAuthenticate = () => {
    const { updateUser } = useContext(UserContext);
   
    const authenticate = (loginData: LoginData): void => {
      updateUser({
        firstName: loginData.first_name,
        lastName: loginData.last_name,
        email: loginData.email,
        id: Number(loginData.user_id)
      });
      localStorage.setItem('userId', loginData.user_id);
      localStorage.setItem('authToken', loginData.access);
      localStorage.setItem('refresh', loginData.refresh);
    };
   
    return { authenticate };
   };
   
   export default useAuthenticate;