import { bot } from "../../clients/bot.ts"
import {
  Interaction,
  InteractionCallbackData,
  InteractionResponseTypes,
} from "../../deps.ts"
import { InteractionContext } from "../types/mod.ts"

export class InteractionContextWithToken {
  constructor(private token: string) {}

  getOriginalMessage = async (token: string) => {
    try {
      return await bot.helpers.getOriginalInteractionResponse(token)
    } catch (err: unknown) {
      console.log(err)
    }
    return
  }

  editOriginalResponse = async (
    token: string,
    options: InteractionCallbackData,
  ) => {
    await bot.helpers.editOriginalInteractionResponse(
      token,
      options,
    )
  }
}

export class InteractionContextImpl extends InteractionContextWithToken
  implements InteractionContext {
  replied = false
  constructor(public interaction: Interaction, token?: string) {
    super(typeof token !== "undefined" ? token : interaction.token)
  }

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
