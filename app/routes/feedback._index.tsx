import { Feedback } from "@prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { db } from '~/utils/db.server'

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  const author = body.get("author")?.toString() ?? "Anonymous"
  const content = body.get("content")?.toString()

  if (!content) {
    throw new Error("Forgot to type your message!");

  }
  const todo = await db.feedback.create({
    data: {
      author,
      content,
    }
  })
  return redirect("/feedback/thanks");
}

export async function loader() {
  return json({ feedbacks: await db.feedback.findMany() });
}

export default function FeedbackRoute() {
  const { feedbacks } = { feedbacks: useLoaderData<Feedback[]>() }

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