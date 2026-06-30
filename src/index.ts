import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

type Bindings = {
  DATABASE_URL: string
  DIRECT_URL: string
}

import { Hono } from 'hono'

const app = new Hono<{Bindings: Bindings}>()

app.post('/hi', async (c) => {
  const input = await c.req.json()
  const prisma = new PrismaClient({
    accelerateUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const response = await prisma.user.create({
    data: {
      email: input.email,
      password: input.password
    },
    select: {
      email: true,
      createdAt: true
    }
  })
  return c.json({
    message: "User Created Successfully",
    data: response
  })
})


export default app
