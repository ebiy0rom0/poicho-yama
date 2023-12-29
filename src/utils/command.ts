import {
  ChatInputInteractionCommand,
  ComponentInteractionExecutor,
} from "../structures/types/mod.ts"

export const createCommand = <T, E extends Error>(
  command: ChatInputInteractionCommand<T, E>,
) => command

export const createExecutor = <T, E extends Error>(
  executor: ComponentInteractionExecutor<T, E>,
) => executor
