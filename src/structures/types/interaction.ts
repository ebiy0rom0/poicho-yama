import { Interaction, InteractionCallbackData, Message } from "../../deps.ts"
import { Empty, Result } from "./result.ts"

export interface InteractionMessageEditor {
  readonly getOriginalMessage: () => Promise<Result<Message, Error>>
  readonly editOriginalResponse: (
    options: InteractionCallbackData,
  ) => Promise<Result<Empty, Error>>
}

export interface InteractionReplyer {
  readonly interaction: Interaction
  readonly getOption: <T>(name: string) => T | undefined
  readonly reply: (options: InteractionCallbackData) => Promise<void>
  readonly replyOnce: (options: InteractionCallbackData) => Promise<void>
}

export interface ChatInputInteractionReplyer extends InteractionReplyer {
  get command(): string
}

export interface ComponentInteractionReplyer extends InteractionReplyer {
  get customID(): string
}
