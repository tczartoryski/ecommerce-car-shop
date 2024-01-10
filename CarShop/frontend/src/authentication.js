
export const authenticate = (loginData) => {
    localStorage.setItem('userId', loginData.user_id);
    localStorage.setItem('authToken', loginData.token);
}

export const isAuthenticated = () => {
    return localStorage.getItem('authToken');
}

export const getUserId = () => {
    return localStorage.getItem('userId');
}

export const logout = () => {
   localStorage.removeItem('authToken')
    window.location.href = '/login';
}

export const request = (url, options) => {
    const authenticatedToken = isAuthenticated();
    console.log(`Authenticated token ${authenticatedToken}`)
    console.log(localStorage.getItem('userId'));
    if (!authenticatedToken) throw Error('AUTHENTICATE FIRST')
    return fetch(('http://127.0.0.1:8000/'+ url), {
        ...options,
        headers: {
            'Authorization':`Token ${authenticatedToken}`,
            ...options?.headers
        }
    })
}