import { bot } from "../../clients/bot.ts"
import {
  Interaction,
  InteractionCallbackData,
  InteractionResponseTypes,
  Message,
} from "../../deps.ts"
import { InteractionMessageEditor, InteractionReplyer } from "../types/mod.ts"
import { Failure, Result, Success, SuccessOnly } from "../types/result.ts"

export class InteractionContextWithToken implements InteractionMessageEditor {
  constructor(private token: string) {}

  getOriginalMessage = async (): Promise<Result<Message, Error>> => {
    return await bot.helpers.getOriginalInteractionResponse(this.token)
      .then((message) => Success(message))
      .catch((reason) => Failure(new Error(reason)))
  }

  editOriginalResponse = async (
    options: InteractionCallbackData,
  ) => {
    return await bot.helpers.editOriginalInteractionResponse(this.token, options)
      .then((_) => SuccessOnly())
      .catch((reason) => Failure(new Error(reason)))
  }
}

export class InteractionContext implements InteractionReplyer {
  replied = false
  constructor(public interaction: Interaction) {}

  get userID() {
    return this.interaction.user.id
  }
  get username() {
    return this.interaction.user.username
  }

  getOption = <T>(name: string): T | undefined => {
    const options = this.interaction.data?.options ?? []
    return options.find((opt) => opt.name === name)?.value as T
  }

  reply = async (options: InteractionCallbackData) => {
    if (this.replied) {
      await bot.helpers.editOriginalInteractionResponse(
        this.interaction.token,
        options,
      )
      return
    }

    this.replied = true
    await bot.helpers.sendInteractionResponse(
      this.interaction.id,
      this.interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: options,
      },
    )
  }

  replyOnce = async (options: InteractionCallbackData) => {
    if (!this.replied) await this.reply(options)
  }
}
