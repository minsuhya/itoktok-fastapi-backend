import router from '@/router'

export function useGlobalNavigation() {
  const navigateTo = (route, replace = true) => {
    if (replace) {
      router.replace(route)
      return
    }
    router.push(route)
  }

  return {
    navigateTo
  }
}
