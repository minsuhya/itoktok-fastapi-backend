const tokenKey = import.meta.env.VITE_TOKEN_KEY

const isLogin = () => {
  return !!localStorage.getItem(tokenKey)
}

const getToken = () => {
  return localStorage.getItem(tokenKey)
}

const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

const clearToken = () => {
  localStorage.removeItem(tokenKey)
}

export { isLogin, getToken, setToken, clearToken }
