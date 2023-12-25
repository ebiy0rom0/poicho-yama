import { Interaction, InteractionCallbackData } from "../../deps.ts"

export interface InteractionContext {
  readonly interaction: Interaction
  readonly getOption: <T>(name: string) => T | undefined
  readonly reply: (options: InteractionCallbackData) => Promise<void>
  readonly replyOnce: (options: InteractionCallbackData) => Promise<void>
  readonly editOriginalResponse: (
    token: string,
    options: InteractionCallbackData,
  ) => Promise<void>
}

export interface ChatInputInteractionContext extends InteractionContext {
  get command(): string
}

export interface ComponentInteractionContext extends InteractionContext {
  get customID(): string
}
