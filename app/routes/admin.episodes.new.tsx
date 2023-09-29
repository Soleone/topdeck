import { Form, Link, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json, redirect } from "@vercel/remix";
import { Save } from "lucide-react";
import invariant from "tiny-invariant";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { db } from "~/lib/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const path = formData.get("path")?.toString()
  const title = formData.get("title")?.toString()
  const src = formData.get("src")?.toString()
  const description = formData.get("description")?.toString()
  const publishedOn = formData.get("published-on")?.toString()

  let publishedOnDate: Date
  const result = {}
  try {
    invariant(path, "path is required")
    invariant(title, "title is required")
    invariant(src, "src is required")
    invariant(description, "description is required")
    invariant(publishedOn, "publishedOn is required")
    publishedOnDate = new Date(publishedOn)
    invariant(publishedOnDate, "publishedOn needs to be a valid date")
  } catch (error) {
    if (error instanceof Error) {
      const message = error.message.replace(/^Invariant failed: /, "")
      return json({ success: false, error: message })
    } else {
      return json({ success: false, error: "Unknown error" })
    }
  }

  const newEpisode = {
    path,
    title,
    src,
    description,
    publishedOn: publishedOnDate
  }

  await db.episode.create({ data: newEpisode })

  return redirect("/admin/episodes")
}



export default function AdminEpisodesNewRoute() {
  const result = useActionData<typeof action>()

  return <div>
    <Card>
      <CardHeader>
        <CardTitle>
          New episode
        </CardTitle>
        <CardDescription>
          Submit new published episode to be listed here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form method="post">
          <div>
            <Label className="flex items-center mb-1">
              Path
            </Label>
            <Input type="text" name="path"></Input>
          </div>
          <div className="mt-4">
            <Label className="flex items-center mb-1">
              Title
            </Label>
            <Input type="text" name="title"></Input>
          </div>
          <div className="mt-4">
            <Label className="flex items-center mb-1">
              Audio file path
            </Label>
            <Input type="text" name="src"></Input>
          </div>
          <div className="mt-4">
            <Label className="flex items-center mb-1">
              Description
            </Label>
            <Textarea name="description"></Textarea>
          </div>
          <div className="mt-4">
            <Label className="flex items-center mb-1">
              Published on
            </Label>
            <Input type="date" name="published-on"></Input>
          </div>

          <div className="mt-4 flex justify-between">
            <Button type="submit" name="intent" value="login">
              <Save className="mr-1 h-4 w-4" />
              Submit
            </Button>
            {result?.error ? <Badge variant="destructive" className="ml-1 mt-2">{result.error}</Badge> : null}
          </div>
        </Form>
      </CardContent>
    </Card>
  </div>
}