import { cssBundleHref } from "@remix-run/css-bundle"
import { json, type LinksFunction, type LoaderFunctionArgs } from "@vercel/remix"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import stylesheet from "~/tailwind.css"
import React from "react"
import { authenticator } from "./services/auth.server"
import { Badge } from "./components/ui/badge"
export { ErrorBoundary } from "./components/error_boundary"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  if (user) {
    return json({ user })
  } else {
    return json({ user: null })
  }
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </Layout>
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>()

  return <>
    <div className="p-4 mx-0 lg:mx-auto max-w-full lg:max-w-screen-lg">
      <h1 className="mb-10">
        <a href="/home" className="flex flex-col items-center">
          <img src="/logo.png" width="160" className="mb-2" />
          <span>A Gods Unchained Podcast</span>
        </a>
      </h1>
      {!!user && <div className="mb-4 flex items-center">
        <Badge variant="outline" className="text-sm mx-auto">
          {user.email}
        </Badge>
      </div>}
      <Outlet />
    </div >
    {children}
  </>
}