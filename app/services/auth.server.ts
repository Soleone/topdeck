import { User } from "@prisma/client"
import { Authenticator, AuthorizationError } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"
import * as argon2 from "argon2"
import { sessionStorage } from "~/services/session.server"
import { db } from "~/lib/db.server"

export const authenticator = new Authenticator<User>(sessionStorage)

function extractPresenceValidatedEmailAndPassword(form: FormData) {
  const email = form.get("email")?.toString()
  const password = form.get("password")?.toString()

  invariant(email, "Email invalid")
  invariant(password, "Password is required")

  return { email, password }
}

// Signup
authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const { email, password } = extractPresenceValidatedEmailAndPassword(form)

  const existingUser = await db.user.findUnique({ where: { email } })
  invariant(!existingUser, "User already exists")

  const hashedPassword = await argon2.hash(password)
  return await db.user.create({ data: { email, password: hashedPassword } })
}), "form-signup")

// Login
authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const { email, password } = extractPresenceValidatedEmailAndPassword(form)

  const existingUser = await db.user.findUnique({ where: { email } })

  if (existingUser) {
    const passwordMatches = await argon2.verify(existingUser.password, password)
    invariant(passwordMatches, "Password does not match")
    return existingUser
  } else {
    throw new AuthorizationError("User not found")
  }
}), "form-login")
