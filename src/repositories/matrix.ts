import { dbHandler } from "../clients/dbHandler.ts"
import { Combinations } from "../structures/types/mod.ts"

const TOP_KEY = "matrix"

export class MatrixRepository {
  private constructor() {}

  static setMatrix = async (music: string, point: number, row: Combinations): Promise<void> => {
    await dbHandler.set([TOP_KEY, music, point], row)
  }

  static getMatrix = async (music: string, point: number): Promise<Deno.KvEntryMaybe<Combinations>> => {
    return await dbHandler.get<Combinations>([TOP_KEY, music, point])
  }
}