import { User } from "@prisma/client"
import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"
import { sessionStorage } from "~/services/session.server"

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const email = form.get("email")?.toString()
  const password = form.get("password")?.toString()

  invariant(email, "Email invalid")
  invariant(password, "Password is required")

  // TODO: Hash password
  const user = {
    id: 123,
    email: "tester@example.com",
    password: "password2"
  }
  return user
}))