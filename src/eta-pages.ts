
import { Hono } from 'hono'
import path from 'node:path'
import { Eta } from 'eta'
import { team } from './data'

const etaPages = new Hono()

const eta = new Eta({
  views: path.join(import.meta.dirname, '..', 'views')
})

etaPages.get('/team', (c) =>
  c.html(eta.render('./team', { team, title: 'Team' }))
)

etaPages.get('/hello', (c) => {
  const name = c.req.query('name') ?? 'stranger'

  return c.html(
    eta.render('./hello', { name, title: 'Hello' })
  )
})

export { etaPages }

