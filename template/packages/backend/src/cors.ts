import { env } from 'hono/adapter'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'

export const corsMiddleware = createMiddleware<{ Bindings: Env }>(
  async (c, next) =>
    cors({
      origin: env(c).CORS_ALLOW_ORIGIN,
      credentials: true,
    })(c, next),
)
