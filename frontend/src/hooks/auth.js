import { login, logout, readMe } from '@/api/user'
import { useUserStore } from '@/stores/auth'
import { clearToken, setToken } from '@/utils/token'
// import { removeRouteListener } from '@/utils/routerListener'
/**
 *
 * @desc system authentication
 */
export default function useAuth() {
  const loginApp = async (data) => {
    const userStore = useUserStore()
    try {
      // 인증
      const res = await login(data)
      setToken(res.access_token)

      // 인증 후 사용자 정보 가져오기
      const userInfo = await readMe()
      userStore.setUserInfo(userInfo)
    } catch (err) {
      clearToken()
      userStore.clearUserInfo()
      throw err
    }
  }

  const logoutApp = async () => {
    const userStore = useUserStore()
    userStore.clearUserInfo()
    clearToken()
  }

  return {
    loginApp,
    logoutApp
  }
}
