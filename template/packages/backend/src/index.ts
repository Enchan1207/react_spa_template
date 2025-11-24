import { Hono } from 'hono'

import { corsMiddleware } from './cors'

const app = new Hono<{ Bindings: Env }>()
  .use(corsMiddleware)
  .get('/', (c) => c.json({ message: 'Hello, World!' }))

export default app
export type AppType = typeof app
