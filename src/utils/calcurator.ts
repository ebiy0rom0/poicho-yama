import { dbHandler } from "../clients/dbHandler.ts"
import { Combinations } from "../structures/types/mod.ts"

const MAX_BONUS = 400     // from 0% to 400%
const SCORE_RANGE = 125   // from 0 to 2,500,000

export class PointCalculator {
  #matrix = new Map<number, Combinations>

  private constructor() {}

  private load = async () => {
    const matrix = await dbHandler.list<Combinations>({ prefix: ["matrix"] })
    for await (const row of matrix) {
      this.#matrix.set(row.key[1] as number, row.value)
    }

    if (this.#matrix.size > 0) return

    for (let bonus = 0; bonus < MAX_BONUS; bonus ++) {
      for (let score = 0; score < SCORE_RANGE; score ++) {
        const pt = Math.floor((100 + score) * (100 + bonus) / 100)
        let combi: Combinations = []
        if (this.#matrix.has(pt)) {
          combi = this.#matrix.get(pt)!
        }
        combi.push({ bonus: bonus, score: score * 20000 })
        this.#matrix.set(pt, combi)
      }
    }
    await this.#matrix.forEach(async (v, k) => await dbHandler.set(["matrix", k], v))
  }

  static New = async () => {
    const ins = new PointCalculator()
    await ins.load()
    return ins
  }

  findCombination = (pt: number): Combinations => this.#matrix.get(pt) ?? []
}