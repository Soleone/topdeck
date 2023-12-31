import type { ActionFunctionArgs } from "@vercel/remix"
import { json, redirect } from "@vercel/remix"
import { Form, useActionData } from "@remix-run/react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { db } from '~/lib/db.server'

export async function action({
  request,
}: ActionFunctionArgs) {
  const body = await request.formData();

  const author = body.get("author")?.toString() ?? "Anonymous"
  const content = body.get("content")?.toString()

  if (!content) {
    return json({ content: "Forgot to type your message!" })
  } else {
    await db.feedback.create({
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
    <div>
      <Form method="post">
        <Card className="">
          <CardHeader>
            <CardTitle>Leave feedback</CardTitle>
            <CardDescription>Send us a message and we'll see if we can incorporate it in the show.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label>Your message</Label>
            <Textarea name="content" />
            {errors?.content ? <div className="text-red-500 mt-1 mb-2"><Badge variant="destructive" className="mr-1">Error</Badge>{errors?.content}</div> : null}
            <Label className="mt-4 inline-block">Your name</Label>
            <Input type="text" name="author" />
          </CardContent>
          <CardFooter>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  )
}