import { dbHandler } from "../clients/dbHandler.ts"
import { Matrix, MatrixRows } from "../structures/types/mod.ts"

const TOP_KEY = "matrix"

export class MatrixRepository {
  private constructor() {}

  static setMatrixRow = async (base: number, point: number, rows: MatrixRows): Promise<void> => {
    await dbHandler.set([TOP_KEY, base, point], rows)
  }

  static getMatrixRow = async (base: number, point: number): Promise<MatrixRows> => {
    const rows = await dbHandler.get<MatrixRows>([TOP_KEY, base, point])
    return rows.value ?? []
  }

  static getMatrix = async (base: number): Promise<Matrix> => {
    const matrixIter = await dbHandler.list<MatrixRows>({ prefix: [TOP_KEY, base] })
    const matrix = new Map<number, MatrixRows>()
    for await (const row of matrixIter) {
      const [,, point] = row.key
      matrix.set(point as number, row.value)
    }
    return matrix
  }
}