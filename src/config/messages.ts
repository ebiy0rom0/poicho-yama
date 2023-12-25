export const Messages = {
  Info: "{0}ポイントだね？\rオッケー、ボクに任せてよ！",
  NotFound: "",
}

// deno-lint-ignore no-explicit-any
export const T = (template: string, ...args: any[]): string => {
  args.forEach((v, i) =>
    template = template.replace(new RegExp(`\\{${i}\\}`), v)
  )
  return template
}
