import { InteractionContextImpl } from "./interactionContext.ts"
import { ComponentInteractionContext } from "./../types/mod.ts"

export class MessageComponentInteractionContext extends InteractionContextImpl
  implements ComponentInteractionContext {
  get customID() {
    return this.interaction.data?.customId!
  }
}
