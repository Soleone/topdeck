import { Label } from "@radix-ui/react-label"
import { Form, useActionData } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { LogIn, UserPlus2 } from "lucide-react"
import { ActionFunctionArgs, json } from "@vercel/remix"
import UserInputs from "~/components/user_inputs"

export async function action({ request }: ActionFunctionArgs) {
  const errors: Record<string, string> = {}

  const data = await request.formData()
  const email = data.get("email")?.toString()
  const password = data.get("password")?.toString()
  // TODO: Hash password

  if (!email) {
    errors.email = "Invalid"
  }

  if (!password) {
    errors.password = "Required"
  }

  let user = null
  //user = authenticator.authenticate(request)
  return json(errors)
}

export default function LoginRoute() {
  const errors = useActionData<typeof action>()

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
                <UserInputs errors={errors} />
                <div className="mt-4">
                  <Button type="submit">
                    <LogIn className="mr-1 h-4 w-4" />
                    Sign in
                  </Button>
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
    </div>
  )
}