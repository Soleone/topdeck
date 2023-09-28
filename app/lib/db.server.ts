import { PrismaClient } from '@prisma/client'
// import { PrismaClient } from '@prisma/client/edge' // Use for edge functions
import { withAccelerate } from '@prisma/extension-accelerate';

function makePrisma() {
  const client = new PrismaClient()
  // TODO: Is this actually using withAccelerate like this?
  client.$extends(withAccelerate())
  return client
}

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof makePrisma>
}

export const db = globalForPrisma.prisma ?? makePrisma()

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = makePrisma()
