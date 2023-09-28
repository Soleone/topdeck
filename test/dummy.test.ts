import { expect, test } from '@jest/globals'
import * as argon from "argon2"

test("basic argus2 hash validation test", async () => {
  const hash = await argon.hash("test-pass")

  const isValid = await argon.verify(hash, "test-pass")
  expect(isValid).toBe(true)
})
