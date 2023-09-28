import { User } from "@prisma/client"
import { Authenticator, AuthorizationError } from "remix-auth"
import { FormStrategy } from "remix-auth-form"
import invariant from "tiny-invariant"
import { sessionStorage } from "~/services/session.server"
import { db } from "~/lib/db.server"

export const authenticator = new Authenticator<User>(sessionStorage)

function hashPassword(password: string) {
  return password
}

function extractValidatedEmailAndPassword(form: FormData) {
  const email = form.get("email")?.toString()
  const password = form.get("password")?.toString()

  invariant(email, "Email invalid")
  invariant(password, "Password is required")

  const hashedPassword = hashPassword(password)

  return { email, password: hashedPassword }
}

// Login
authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const { email, password } = extractValidatedEmailAndPassword(form)

  const existingUser = await db.user.findUnique({ where: { email } })

  if (existingUser) {
    invariant(existingUser.password === password, "Password is invalid")
    return existingUser
  } else {
    throw new AuthorizationError("User not found")
  }
}), "form-login")

// Signup
authenticator.use(new FormStrategy<User>(async ({ form }) => {
  const { email, password } = extractValidatedEmailAndPassword(form)

  const existingUser = await db.user.findUnique({ where: { email } })
  console.log(`Found existing user: ${existingUser}`)
  invariant(!existingUser, "User already exists")

  console.log(`Creating new user: ${email} and ${password}`)
  return await db.user.create({ data: { email, password } })
}), "form-signup")