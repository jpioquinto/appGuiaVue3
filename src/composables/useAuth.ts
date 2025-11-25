import { useConfigStore } from '@/stores/config'
import { useRouter } from 'vue-router'

export function useAuth() {
  const configStore = useConfigStore()
  const router = useRouter()

  const logout = () => {
    if (configStore.getToken) {
      configStore?.destruirToken()!.then(() => {
        configStore.asignarLayout('default')
        router.push('/login')
        /*setTimeout(() => {
          location.reload()
        }, 1000)*/
      })
    }
  }

  return {
    logout,
  }
}
