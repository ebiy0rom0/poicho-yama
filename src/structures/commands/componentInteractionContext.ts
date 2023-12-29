import { InteractionContext } from "./interactionContext.ts"
import { ComponentInteractionReplyer } from "./../types/mod.ts"

// deno-fmt-ignore
export class MessageComponentInteractionContext extends InteractionContext implements ComponentInteractionReplyer {
  get customID() {
    return this.interaction.data?.customId!
  }
}
