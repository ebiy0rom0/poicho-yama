import { InteractionContext } from "../commands/interactionContext.ts"
import { ChatInputInteractionReplyer } from "../types/mod.ts"

// deno-fmt-ignore
export class ChatInputInteractionContext extends InteractionContext implements ChatInputInteractionReplyer {
  get command() {
    return this.interaction.data?.name!
  }
}
