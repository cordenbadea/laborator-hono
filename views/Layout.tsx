
import type { Child } from 'hono/jsx'

export const Layout = (props: { title: string; children?: Child }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>{props.title} · Office site</title>
    </head>
    <body>
      <main>{props.children}</main>
    </body>
  </html>
)
