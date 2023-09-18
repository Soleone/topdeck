export function loader() {
  return new Response("alive", { status: 200, headers: { "Content-Type": "text/plain" } })
}
