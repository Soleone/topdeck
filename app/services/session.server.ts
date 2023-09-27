import { createCookieSessionStorage } from "@vercel/remix"

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "strict",
    path: "/",
    httpOnly: true,
    secrets: [],
    secure: process.env.NODE_ENV === "production"
  }
})

export const { getSession, commitSession, destroySession } = sessionStorage