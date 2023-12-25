import "./config/load.ts"
import "./cron/load.ts"
import { startBot, http } from "./deps.ts"
import { bot } from "./clients/bot.ts"
import { httpListener } from "./clients/httpListener.ts"
import PointCommand from "./commands/point.ts"
import { setInteractionCreate } from "./events/interactionCreate.ts"

http.serveListener(httpListener, _ => {
  return new Response('pong', { status: 200 })
})

setInteractionCreate()
await bot.helpers.upsertGlobalApplicationCommands(
  [ PointCommand ],
)

await startBot(bot)