import { AuthorizationError } from "remix-auth"
import { Form, useActionData } from "@remix-run/react"
import { LogIn, UserPlus2 } from "lucide-react"
import { ActionFunctionArgs, json } from "@vercel/remix"
import { authenticator } from "~/services/auth.server"
import UserInputs from "~/components/user_inputs"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate("form", request, {
      successRedirect: "/home",
      throwOnError: true
    })
  } catch (error) {
    if (error instanceof AuthorizationError) {
      const userError = error.message.replace(/^Invariant failed: /, '')
      return json({ error: userError })
    } else if (error instanceof Response) {
      return error
    } else {
      return json({ error: "Unknown error" })
    }
  }
}

export default function LoginRoute() {
  const status = useActionData<typeof action>()

  return (
    <div>
      <Tabs defaultValue="login" className="max-w-sm mx-auto">
        <TabsList>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>
                Login
              </CardTitle>
              <CardDescription>
                Sign in with an existing account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" action="/login">
                <UserInputs />

                <div className="mt-4 flex justify-between">
                  <Button type="submit">
                    <LogIn className="mr-1 h-4 w-4" />
                    Sign in
                  </Button>
                  {status?.error ? <Badge variant="destructive" className="ml-1 mt-2">{status.error}</Badge> : null}
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>
                Sign up
              </CardTitle>
              <CardDescription>
                Create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form method="post" action="/signup">
                <UserInputs />

                <div className="mt-4">
                  <Button type="submit">
                    <UserPlus2 className="mr-1 h-4 w-4" />
                    Create account
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}