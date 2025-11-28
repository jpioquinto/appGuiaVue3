import router from '@/router'

import { useProjectStore } from '@/stores/project/project'
import { useDashboardStore } from '@/stores/dashboard'

export function useDashboard() {
  const project = useProjectStore()
  const dashStore = useDashboardStore()

  const clickConsultar = (payload: MouseEvent): void => {
    if (dashStore.currentProject) {
      project.id = dashStore.currentProject.id
      project.anio = dashStore.currentProject.anio
      project.version = dashStore.currentProject.version
      project.estatus = dashStore.currentProject.estatus
      project.vertiente = dashStore.currentProject.vertiente
      project.estructura.resumen.millar = dashStore.currentProject.millar

      project.diagnostico.id = dashStore.currentProject.diagnosticoId
      project.diagnostico.anio = dashStore.currentProject.anio
    }

    router.push('/proyecto/introduccion')
  }

  return {
    evento: {
      clickConsultar,
    },
  }
}
