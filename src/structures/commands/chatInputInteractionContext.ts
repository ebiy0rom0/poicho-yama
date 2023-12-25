import { InteractionContextImpl } from "../commands/interactionContext.ts"

export class ChatInputInteractionContext extends InteractionContextImpl {
  get command() {
    return this.interaction.data?.name!
  }
}
