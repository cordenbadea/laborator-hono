
import { Hono } from 'hono'

const stringPages = new Hono()

const layout = (title: string, body: string) => `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${title} · Office site</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <nav>
        <a href="/">Home</a> ·
        <a href="/team">Team</a>
      </nav>
      ${body}
    </body>
  </html>
`

stringPages.get('/', (c) => {
  const name = c.req.query('name') ?? 'stranger'

  return c.html(
    layout('Home', `<h1>Hello, ${name}!</h1>`)
  )
})

stringPages.get('/team', (c) =>
  c.html(layout('Team', '<h1>Team</h1>'))
)

export { stringPages }
