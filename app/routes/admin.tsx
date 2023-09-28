import { useLoaderData } from "@remix-run/react"
import { LoaderFunctionArgs, json, redirect } from "@vercel/remix"
import { authenticator } from "~/services/auth.server"
import { db } from "~/lib/db.server"

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request)

  if (user) {
    const feedbacks = await db.feedback.findMany()
    return json(feedbacks)
  } else {
    return redirect("/login")
  }
}

export default function AdminRoute() {
  const feedbacks = useLoaderData<typeof loader>()

  return (
    <>
      <h2 className="text-2xl">Submitted feedback</h2>
      {
        feedbacks.map((feedback, index) => {
          return <div key={feedback.id}>
            {index + 1}. {feedback.content} <span className="text-sm">by {feedback.author ?? "Anonymous"}</span>
          </div>
        })
      }
    </>
  )
}