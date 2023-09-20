import { Links, Meta, Scripts, isRouteErrorResponse, useRouteError } from "@remix-run/react"

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>

      <body>
        {isRouteErrorResponse(error) ?
          <div>
            <p>{error.status}</p>
            <p>{error.statusText}</p>
            <p>{error.data}</p>
          </div>
          : (error instanceof Error) ?
            <div>
              <p>{error.message}</p>
              <p>{error.stack}</p>
            </div>
            : <div>Unknown error</div>}
        <Scripts />
      </body>
    </html>
  )
}