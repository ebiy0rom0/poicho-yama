import { dbHandler } from "../clients/dbHandler.ts"

const TOP_KEY = "interaciton"

export class InteractionRepository {
  private constructor() {}

  static setToken = async (guildID: bigint, token: string): Promise<number> => {
    const timestamp = Date.now()
    // const expiredIn = timestamp + 5 * 60 * 1000  // 5 minutes later
    const expiredIn = timestamp + 10 * 1000 // debug: 10 seconds later
    await dbHandler.set([TOP_KEY, "token", `${guildID}/${timestamp}`], {
      token,
      expiredIn,
    })

    return timestamp
  }

  static getOriginalToken = async (
    guildID: bigint,
    timestamp: number,
  ): Promise<string | undefined> => {
    const interaction = await dbHandler.get<
      { token: string; expiredIn: number }
    >([TOP_KEY, "token", `${guildID}/${timestamp}`])
    return interaction.value?.token
  }

  static getExpiredTokens = async (): Promise<string[]> => {
    const tokens = await dbHandler.list<{ token: string; expiredIn: number }>({
      prefix: [TOP_KEY, "token"],
    })
    const expiredTokens: string[] = []
    const timestamp = Date.now()
    for await (const token of tokens) {
      if (timestamp < token.value.expiredIn) continue

      // TODO: delete
      dbHandler.delete(token.key)
      expiredTokens.push(token.value.token)
    }
    return expiredTokens
  }
}
