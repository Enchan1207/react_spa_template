import { serve } from '@hono/node-server'
import 'dotenv/config'
import app from '.'

serve(app)
