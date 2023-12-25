import { ActionRow, Interaction } from "../deps.ts";
import { InteractionRepository } from "../repositories/interaction.ts";
import { InteractionContextImpl } from "../structures/commands/interactionContext.ts";
import { disableButtonComponents } from "../utils/component.ts";

Deno.cron("Disable buttons for expired token", "* * * * *", async () => {
  const ctx = new InteractionContextImpl({} as Interaction)
  await Promise.all((await InteractionRepository.getExpiredTokens()).map(async token => {
    console.log(`Expired token: ${token}`)
    const message = await ctx.getOriginalMessage(token)
    if (typeof message === "undefined") {
    console.log("Original message is already deleted.")
    return
    }

    message.components?.map(component => disableButtonComponents(component))

    await ctx.editOriginalResponse(token, {
    content: message.content,
    components: message.components as ActionRow[],
    embeds: message.embeds
    })
  }))
})
