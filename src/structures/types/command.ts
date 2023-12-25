import { CreateSlashApplicationCommand } from "../../deps.ts"
import {
  ChatInputInteractionContext,
  ComponentInteractionContext,
} from "./interaction.ts"

export interface ChatInputInteractionCommand
  extends Readonly<CreateSlashApplicationCommand> {
  readonly execute: (ctx: ChatInputInteractionContext) => Promise<unknown>
}

export interface ComponentInteractionExecutor {
  readonly execute: (ctx: ComponentInteractionContext) => Promise<unknown>
}
