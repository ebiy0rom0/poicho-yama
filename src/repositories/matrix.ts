import { dbHandler } from "../clients/dbHandler.ts"
import { Matrix, MatrixRows } from "../structures/types/mod.ts"

const TOP_KEY = "matrix"

const cache = new Map<number, Matrix>()

export class MatrixRepository {
  private constructor() {}

  static setMatrixRows = async (base: number, point: number, rows: MatrixRows): Promise<void> => {
    await dbHandler.set([TOP_KEY, base, point], rows)
  }

  static getMatrix = async (base: number): Promise<Matrix> => {
    if (cache.has(base)) {
      console.log("load cache!")
      return cache.get(base)!
    }

    const matrix = new Map<number, MatrixRows>()
    const matrixIter = await dbHandler.list<MatrixRows>({ prefix: [TOP_KEY, base] })
    for await (const row of matrixIter) {
      const [,, point] = row.key
      matrix.set(point as number, row.value)
    }

    if (matrix.size > 0) cache.set(base, matrix)  // set cache
    return matrix
  }
}