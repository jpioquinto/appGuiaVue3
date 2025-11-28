import type { InjectionKey } from 'vue'

import type { Distribute } from '@/types/partialProps'

export const DistributeKey: InjectionKey<Distribute> = Symbol('Distribute')
