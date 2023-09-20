import type { LoaderFunction, MetaFunction } from "@remix-run/node"

const ROOT_URL_REDIRECT = "https://podcasters.spotify.com/pod/show/topdeckpodcast"

export const loader: LoaderFunction = () => {
  return new Response(null, { status: 301, headers: { "Location": ROOT_URL_REDIRECT } })
}