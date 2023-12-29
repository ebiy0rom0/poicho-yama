import { ActionRow } from "../deps.ts"
import { InteractionRepository } from "../repositories/interaction.ts"
import { InteractionContextWithToken } from "../structures/commands/interactionContext.ts"
import { disableButtonComponents } from "../utils/component.ts"

Deno.cron("Disable buttons for expired token", "*/5 * * * *", async () => {
  await Promise.all(
    (await InteractionRepository.getExpiredTokens()).map(async (token) => {
      const ctx = new InteractionContextWithToken(token)
      const result = await ctx.getOriginalMessage()
      if (!result.ok) {
        console.log("expired token")
        return
      }
      const message = result.value
      message.components?.map((component) => disableButtonComponents(component))

      await ctx.editOriginalResponse({
        content: message.content,
        components: message.components as ActionRow[],
        embeds: message.embeds,
      })
    }),
  )
})
