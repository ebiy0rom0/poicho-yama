import { createEmbedFiled } from "../embed.ts"

// Number of content displayed on the page.
export const CONTENTS_LIMIT = 10

export const COMMAND_NAME = "point"

// deno-lint-ignore no-explicit-any
export const generateMessageFields = (
  contents: any[],
  limit: number,
  offset: number,
) => (
  contents.slice(offset, offset + limit).map((v) =>
    createEmbedFiled({
      name: `${v.bonus}%`,
      value: `${String(v.score.toLocaleString())} - ${
        (v.score + 19999).toLocaleString()
      }`,
      inline: false,
    })
  )
)
