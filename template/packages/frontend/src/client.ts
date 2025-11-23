// NOTE: バックエンドは極力importしない

import type { AppType } from '@routes'
import { hc } from 'hono/client'

const env = import.meta.env
export const client = hc<AppType>(env.VITE_API_URL, {
  init: { credentials: 'include' },
})
