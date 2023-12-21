import { Interaction, InteractionCallbackData } from "../../deps.ts"
import { InteractionContextImpl } from "../commands/interactionContext.ts"

export interface InteractionContext {
  readonly interaction: Interaction
  readonly getOption: <T>(name: string) => T | undefined
  readonly reply: (options: InteractionCallbackData) => Promise<void>
  readonly replyOnce: (options: InteractionCallbackData) => Promise<void>
  readonly editOriginalResponse: (token: string, options: InteractionCallbackData) => Promise<void>
}

export interface ComponentInteractionContext extends InteractionContextImpl {
  get customID (): string
}
