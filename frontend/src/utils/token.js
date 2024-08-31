// token key
const tokenKey = import.meta.env.VITE_TOKEN_KEY

// token functions islogin, getToken, setToken, clearToken
export const isLogin = () => {
  return !!localStorage.getItem(tokenKey)
}

export const getToken = () => {
  return localStorage.getItem(tokenKey)
}

export const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

export const clearToken = () => {
  localStorage.removeItem(tokenKey)
}
