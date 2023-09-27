import { User } from "@prisma/client"
import { Authenticator } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"
import { sessionStorage } from "~/services/session.server"
import { db } from "~/utils/db.server"

export const authenticator = new Authenticator<User>(sessionStorage)

authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const email = form.get("email")?.toString()
  const password = form.get("password")?.toString()

  invariant(email, "Email invalid")
  invariant(password, "Password is required")

  // TODO: Hash password
  const hashed_password = password

  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    invariant(existingUser.password === password, "Password is invalid")
    return existingUser
  } else {
    // TODO: Move this into dedicated signup
    return await db.user.create({ data: { email, password: hashed_password } })
  }
}))