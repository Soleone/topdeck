import { json, type LinksFunction, type LoaderFunctionArgs } from "@vercel/remix"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react"

import stylesheet from "~/tailwind.css?url"
import React from "react"
import { authenticator } from "./services/auth.server"
import { Badge } from "./components/ui/badge"
import { ThemeProvider } from "@/components/soleone/theme"
import { ThemePicker } from "@/components/soleone/theme-picker"
import { HOTKEY_FALLBACKS, THEME_STORAGE_KEY } from "./lib/theme"
import { themeHead } from "./lib/theme.server"
export { ErrorBoundary } from "./components/error_boundary"

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }]

const externalLinks = [
  {
    image: "x.png",
    title: "X (Twitter)",
    // A black mark, so dark themes flip it to white.
    invert: true,
    url: "https://twitter.com/topdeckcast"
  },
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
    title: "RSS feed",
    url: "https://anchor.fm/s/e8ea1170/podcast/rss"
  },
]

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)
  return json({ user: user ?? null, theme: themeHead })
}

export default function App() {
  const { theme } = useLoaderData<typeof loader>()

  // The head script sets data-theme and .dark on <html> before paint, so React must not fight it.
  return (
    <html lang="en" className={theme.defaultThemeIsDark ? "dark" : undefined} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* The default theme leads the list; the provider updates this when the theme changes. */}
        <meta name="theme-color" content={theme.themeOptions[0].canvas} />
        <Meta />
        <Links />
        <style dangerouslySetInnerHTML={{ __html: theme.themeStyles }} />
        <script dangerouslySetInnerHTML={{ __html: theme.themeScript }} />
      </head>
      <body>
        <ThemeProvider themes={theme.themeOptions} storageKey={THEME_STORAGE_KEY} hotkeyFallbacks={HOTKEY_FALLBACKS}>
          <Layout>
            <ScrollRestoration />
            <Scripts />
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>()

  return <>
    <div className="relative p-4 mx-0 lg:mx-auto max-w-full lg:max-w-screen-lg">
      <div className="absolute top-4 right-4">
        <ThemePicker tagline={{ text: "A Gods Unchained podcast", highlight: "by Clutch and Aldous" }} />
      </div>
      <h1 className="mb-2 flex justify-center">
        <a href="/" className="flex flex-col items-center group w-60">
          <img src="/logo.png" width="160" className="mb-2 object-center dark:invert group-hover:scale-110 group-hover:rotate-2 transition transform-gpu" />
          <span className="group-hover:rotate-2 transition transform-gpu">A Gods Unchained Podcast</span>
        </a>
      </h1>
      <div className="flex items-center justify-center gap-2 mb-10">
        {externalLinks.map(({ title, url, image, invert }) => {
          return <a key={title} title={title} href={url} target="_blank"><img src={`/${image}`} className={`${invert ? "dark:invert " : ""}w-6 h-6 hover:shadow-[0_16px_10px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition transform-gpu`} /></a>
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