import { MatrixRepository } from "../repositories/matrix.ts"
import { Matrix, MatrixRows } from "../structures/types/mod.ts"
import { Result } from "../structures/types/result.ts"
import { Failure, Success } from "../structures/utils/result.ts"

const MAX_BONUS = 400 // from 0% to 400%
const SCORE_RANGE = 125 // from 0 to 2,500,000

export class PointCalculator {
  #matrix: Matrix = new Map<number, MatrixRows>()

  private constructor() {}

  private load = async (base: number) => {
    this.#matrix = await MatrixRepository.getMatrix(base)

    if (this.#matrix.size > 0) return

    for (let bonus = 0; bonus < MAX_BONUS; bonus++) {
      for (let score = 0; score < SCORE_RANGE; score++) {
        const point = Math.floor((base + score) * (100 + bonus) / 100)
        let rows: MatrixRows = []
        if (this.#matrix.has(point)) {
          rows = this.#matrix.get(point)!
        }
        rows.push({ bonus: bonus, score: score * 20000 })
        this.#matrix.set(point, rows)
      }
    }
    await this.#matrix.forEach(async (rows, point) =>
      await MatrixRepository.setMatrixRows(base, point, rows)
    )
  }

  static New = async (
    base: number,
  ): Promise<Result<PointCalculator, Error>> => {
    const ins = new PointCalculator()

    return await ins.load(base).then((_) => Success(ins)).catch((err) => Failure(err))
  }

  findRows = (pt: number): MatrixRows => this.#matrix.get(pt) ?? []
}
