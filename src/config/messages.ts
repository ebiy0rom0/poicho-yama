export const Messages = {
  Info: "{0}ポイントだね？\rオッケー、ボクに任せてよ！",
  NotFound: "ごめんね！{0}ポイントは見つからなかったよ。",
  ExpiredToken: "時間切れみたいだね？",
}

// deno-lint-ignore no-explicit-any
export const T = (template: string, ...args: any[]): string => {
  args.forEach((v, i) => template = template.replace(new RegExp(`\\{${i}\\}`), v))
  return template
}
