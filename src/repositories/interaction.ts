import { dbHandler } from "../clients/dbHandler.ts"

const TOP_KEY = "interaciton"

export class InteractionRepository {
  private constructor() {}

  static setToken = async (guildID: bigint, token: string): Promise<number> => {
    const timestamp = Date.now()
    await dbHandler.set([TOP_KEY, "token", `${guildID}/${timestamp}`], [token])
    return timestamp
  }

  static getToken = async (guildID: bigint, timestamp: number): Promise<Deno.KvEntryMaybe<string>> => {
    return await dbHandler.get<string>([TOP_KEY, "token", `${guildID}/${timestamp}`])
  }
}