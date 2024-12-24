import { useContext } from "react";
import UserContext from "../user/UserContext";

// authentication.ts


export const isAuthenticated = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userId'); // Also remove userId
  window.location.href = '/login';
};

export const request = async (
  url: string,
  options?: RequestInit
 ): Promise<Response> => {
  let authenticatedToken = isAuthenticated();
 
  if (!authenticatedToken) throw new Error('AUTHENTICATE FIRST');
 
  const headers: { [key: string]: string } = {
    ...(options?.headers as { [key: string]: string }),
    Authorization: `Bearer ${authenticatedToken}`,
  };

  // Remove 'Content-Type' header if the body is FormData
  if (options?.body instanceof FormData) {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`http://127.0.0.1:8000/${url}`, {
    ...options,
    headers,
  });
 
  if (response.status === 401) {
    // Access token expired, try to refresh
    const newAccessToken = await refreshAccessToken();
 
    if (newAccessToken) {
      // Refresh successful, retry the request with the new access token
      authenticatedToken = newAccessToken;
      return request(url, options);
    } else {
      // Refresh failed, log out the user
      logout();
      throw new Error('Authentication failed');
    }
  }
 
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
 
  return response;
 };
 

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh');
 
  if (!refreshToken) {
    // No refresh token available, log out the user
    logout();
    return null;
  }
 
  try {
    const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
 
    if (!response.ok) {
      // Refresh token is invalid or expired, log out the user
      logout();
      return null;
    }
 
    const data = await response.json();
    const { access } = data;
 
    // Update the access token in local storage
    localStorage.setItem('authToken', access);
 
    return access;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    logout();
    return null;
  }
 };
 