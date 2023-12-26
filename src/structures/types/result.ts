export type Result<T, E extends Error> = Ok<T> | Err<E>

interface Ok<T> {
  readonly ok: true
  readonly value: T
}

export interface Err<E extends Error> {
  readonly ok: false
  readonly err: E
}

export const Success = <T>(value: T): Ok<T> => ({ ok: true, value })
export const SuccessOnly = (): Ok<"ok"> => Success("ok")
export const Failure = <E extends Error>(err: E): Err<E> => ({ ok: false, err })
