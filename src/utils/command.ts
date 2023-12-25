import {
  ChatInputInteractionCommand,
  ComponentInteractionExecutor,
} from "../structures/types/mod.ts"

export const createCommand = (command: ChatInputInteractionCommand) => command

export const createExecutor = (executor: ComponentInteractionExecutor) => executor
