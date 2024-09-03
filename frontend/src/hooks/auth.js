import { login, readMe } from '@/api/user'
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

      // 토큰 저장
      setToken(res.access_token)
      // 인증 후 사용자 정보 가져오기
      const userInfo = await readMe()
      userStore.setUserInfo(userInfo)
    } catch (err) {
      // 인증 실패 시 토큰 및 사용자 정보 삭제
      clearToken()
      // 사용자 정보 삭제
      userStore.clearUserInfo()
      throw err
    }
  }

  const logoutApp = async () => {
    const userStore = useUserStore()
    // 토큰 삭제
    clearToken()
    // 사용자 정보 삭제
    userStore.clearUserInfo()
  }

  return {
    loginApp,
    logoutApp
  }
}
