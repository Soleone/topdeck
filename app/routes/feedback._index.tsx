import type { ActionFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { db } from '~/utils/db.server'

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();
  const todo = await db.Feedback.create({
    data: {
      author: body.get("author") ?? "Anonymous",
      content: body.get("content"),
    }
  })
  return redirect("/feedback/thanks");
}

export async function loader() {
  return json({ feedbacks: await db.Feedback.findMany() });
}

export default function FeedbackRoute() {
  const { feedbacks } = { feedbacks: [] }//useLoaderData<typeof loader>()

  return (
    <>
      <ul>
        {feedbacks.map((feedback) => {
          return <li key={feedback.id}>
            <div>
              {feedback.content} by {feedback.author}
            </div>
          </li>
        })}
      </ul>
      <div>
        <h1>Leave feedback</h1>
        <Form method="post">
          <label>Your message</label>
          <br />
          <textarea name="content" />
          <br />
          <br />
          <label>Your name</label>
          <br />
          <input type="text" name="author" />
          <br />
          <br />
          <button type="submit">Submit</button>
        </Form>
      </div>
    </>
  )
}