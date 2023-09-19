import type { ActionFunctionArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import { db } from '~/utils/db.server'

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  const author = body.get("author")?.toString() ?? "Anonymous"
  const content = body.get("content")?.toString()

  if (!content) {
    return json({ content: "Forgot to type your message!" })
  } else {
    const todo = await db.feedback.create({
      data: {
        author,
        content,
      }
    })
    return redirect("/feedback/thanks");
  }
}

export default function FeedbackRoute() {
  const errors = useActionData<typeof action>()

  return (
    <div className="">
      <h1>Leave feedback</h1>
      <Form method="post">
        <label>Your message</label>
        <br />
        <textarea name="content" />
        <br />
        {errors?.content}
        <br />
        <label>Your name</label>
        <br />
        <input type="text" name="author" />
        <br />
        <br />
        <button type="submit">Submit</button>
      </Form>
    </div>
  )
}