import { createBot } from "../deps.ts"

export const bot = createBot({
  token: Deno.env.get("DISCORD_TOKEN")!,
})