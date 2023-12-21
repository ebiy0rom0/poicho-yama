import { CreateSlashApplicationCommand } from "../../deps.ts"
import { ChatInputInteractionContext } from "../commands/chatInputInteractionContext.ts"
import { ComponentInteractionContext } from "./interaction.ts"

export interface ChatInputInteractionCommand extends Readonly<CreateSlashApplicationCommand> {
    readonly execute: (context: ChatInputInteractionContext) => Promise<unknown>
    readonly executeComponent: (context: ComponentInteractionContext) => Promise<unknown>
  }

