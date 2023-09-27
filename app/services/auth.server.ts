import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"
import { sessionStorage } from "~/services/session.server"

interface User {
  email: string
  password: string
}

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(new FormStrategy(async ({ form }) => {
  const email = form.get("email")?.toString()
  const password = form.get("password")?.toString()

  invariant(email, "Email invalid")
  invariant(password, "Password is required")

  // TODO: Hash password
  const user = {
    email: "tester@example.com",
    password: "password2"
  }
  return user
}))