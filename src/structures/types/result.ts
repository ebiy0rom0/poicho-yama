export type Empty = null
export type Result<T, E extends Error> = Ok<T> | Err<E>

export interface Ok<T = unknown> {
  readonly ok: true
  readonly value: T
}

export interface Err<E extends Error> {
  readonly ok: false
  readonly err: E
}
