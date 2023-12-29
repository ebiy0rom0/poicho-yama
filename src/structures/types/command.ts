import { CreateSlashApplicationCommand } from "../../deps.ts"
import { ChatInputInteractionReplyer, ComponentInteractionReplyer } from "./mod.ts"
import { Result } from "./result.ts"

export interface ChatInputInteractionCommand<T, E extends Error>
  extends Readonly<CreateSlashApplicationCommand> {
  readonly execute: (
    ctx: ChatInputInteractionReplyer,
  ) => Promise<Result<T, E>>
}

export interface ComponentInteractionExecutor<T, E extends Error> {
  readonly execute: (
    ctx: ComponentInteractionReplyer,
  ) => Promise<Result<T, E>>
}
