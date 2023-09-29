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

const externalLinks = [
  {
    image: "apple_podcasts.png",
    title: "Apple Podcasts",
    url: "https://podcasts.apple.com/us/podcast/topdeck/id1707765794"
  },
  {
    image: "spotify.png",
    title: "Spotify",
    url: "https://open.spotify.com/show/4HeQ7GAswDDs9GPvjMZW4D"
  },
  {
    image: "amazon_music.png",
    title: "Amazon Music",
    url: "https://music.amazon.com/podcasts/409d9f7b-f53a-4dcf-a182-eeb5afcd7969/topdeck"
  },
  {
    image: "rss.png",
    title: "Custom RSS feed",
    url: "https://anchor.fm/s/e8ea1170/podcast/rss"
  },
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
      <h1 className="mb-2">
        <a href="/" className="flex flex-col items-center">
          <img src="/logo.png" width="160" className="mb-2" />
          <span>A Gods Unchained Podcast</span>
        </a>
      </h1>
      <div className="flex items-center justify-center gap-1 mb-10">
        {externalLinks.map(({ title, url, image }) => {
          return <a key={title} href={url} target="_blank"><img src={`/${image}`} /></a>
        })}
      </div>

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