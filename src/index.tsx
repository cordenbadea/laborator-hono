
import { Hono } from 'hono'
import { stringPages } from './string-pages'
import { serveStatic } from '@hono/bun'
import { Layout } from '../views/Layout'
import { etaPages } from './eta-pages'


const app = new Hono()

app.use(async (c, next) => {
  const start = performance.now()

  c.set('requestId', crypto.randomUUID().slice(0, 8))

  await next()

  const ms = (performance.now() - start).toFixed(1)

  c.header('X-Response-Time', `${ms}ms`)

  console.log(
    `[${c.get('requestId')}] ${c.req.method} ${c.req.path} ${ms}ms`
  )
})

app.use('*', serveStatic({ root: './public' }))

app.route('/eta', etaPages)

app.get('/jsx', (c) => {
  const name = c.req.query('name') ?? 'stranger'

  return c.html(
    <Layout title="Home">
      <h1>Hello, {name}!</h1>
    </Layout>
  )
})


app.get('/', (c) => {
  return c.html('<h1>Hello World!</h1>')
})

app.get('/page', (c) => {
  return c.html('<h1>The office site</h1>')
})

app.get('/status', (c) => {
  c.header('X-Brewed-By', 'Hono')
  return c.text('Created', 201)
})

app.get('/old', (c) => {
  return c.redirect('/page')
})

app.get('/surveys/:id', (c) => {
  const id = c.req.param('id')
  const tab = c.req.query('tab') ?? 'info'
  const agent = c.req.header('User-Agent')

  return c.json({
    id,
    tab,
    agent,
    method: c.req.method,
    path: c.req.path
  })
})

app.post('/api/data', async (c) => {
  const data = await c.req.json()

  return c.json({
    received: true,
    data
  })
})

app.post('/api/message', async (c) => {
  const message = await c.req.text()

  return c.text(`Ai trimis: ${message}`)
})

app.post('/api/form', async (c) => {
  const body = await c.req.parseBody()

  return c.json(body)
})

app.route('/strings', stringPages)

app.notFound((c) => {
  return c.html(
    <Layout title="Page Not Found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/jsx">Go Home</a>
    </Layout>,
    404
  )
})

app.onError((err, c) => {
  console.error(err)

  return c.html(
    <Layout title="Server Error">
      <h1>500 - Internal Server Error</h1>
      <p>Something went wrong. Please try again later.</p>
      <a href="/jsx">Go Home</a>
    </Layout>,
    500
  )
})

export default app

