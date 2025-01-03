
export const isAuthenticated = (): string | null => {
  return localStorage.getItem('authToken');
};


export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refresh');
  localStorage.removeItem('userId');
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
    const newAccessToken = await refreshAccessToken();
 
    if (newAccessToken) {
      authenticatedToken = newAccessToken;
      return request(url, options);
    } else {
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
      logout();
      return null;
    }
 
    const data = await response.json();
    const { access } = data;
 
    localStorage.setItem('authToken', access);
 
    return access;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    logout();
    return null;
  }
 };
 