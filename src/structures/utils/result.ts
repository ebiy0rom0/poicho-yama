import { Empty, Err, Ok } from "../types/result.ts"

export function Success(): Ok<Empty>
export function Success<T>(value: T): Ok<T>

export function Success<T>(value?: T) {
  return { ok: true, value }
}
export const Failure = <E extends Error>(err: E): Err<E> => ({ ok: false, err })
