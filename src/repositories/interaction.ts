import { dbHandler } from "../clients/dbHandler.ts"

const TOP_KEY = "interaciton"

export class InteractionRepository {
  private constructor() {}

  static setToken = async (guildID: bigint, token: string): Promise<number> => {
    const timestamp = Date.now()
    const expiredIn = timestamp + 5 * 60 * 1000  // 5 minutes later
    await dbHandler.set([TOP_KEY, "token", `${guildID}/${timestamp}`], { token, expiredIn })

    return timestamp
  }

  static getOriginalToken = async (guildID: bigint, timestamp: number): Promise<string | undefined> => {
    const interaction = await dbHandler.get<{ token: string, expiredIn: number }>([TOP_KEY, "token", `${guildID}/${timestamp}`])
    return interaction.value?.token
  }

  static getExpiredTokens = async (guildID: bigint, timestamp: number): Promise<Deno.KvEntryMaybe<string>> => {
    return await dbHandler.get<string>([TOP_KEY, "token", `${guildID}/${timestamp}`])
  }
}