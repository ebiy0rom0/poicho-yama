import { bot } from "../clients/bot.ts"
import PointCommand from "../commands/point/command.ts"
import PointExecutor from "../commands/point/executor.ts"
import { Interaction } from "../deps.ts"
import { ChatInputInteractionContext } from "../structures/commands/chatInputInteractionContext.ts"
import { MessageComponentInteractionContext } from "../structures/commands/componentInteractionContext.ts"
import { InteractionContext } from "../structures/types/mod.ts"
import { isComponentInteraction } from "../utils/component.ts"

export const setInteractionCreate = () => {
  bot.events.interactionCreate = async (_, interaction) => {
    console.log(interaction)
    const ctx =
      await (isComponentInteraction(interaction)
        ? executeComponentInteraction(interaction)
        : executeChatInputInteraction(interaction))

    // Replying to interactions is required.
    // If you forget to reply, return something.
    await ctx.replyOnce({
      flags: 1 << 6, // EPHEMERAL_MESSAGE_FLAGS
      content: "",
    })
  }
}

const executeChatInputInteraction = async (
  interaction: Interaction,
): Promise<InteractionContext> => {
  const ctx = new ChatInputInteractionContext(interaction)
  await PointCommand.execute(ctx)
  return ctx
}

const executeComponentInteraction = async (
  interaction: Interaction,
): Promise<InteractionContext> => {
  const ctx = new MessageComponentInteractionContext(interaction)
  await PointExecutor.execute(ctx)
  return ctx
}
