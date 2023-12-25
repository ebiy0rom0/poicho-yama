
type Music = {
  title: string
  base: number
}

const Musics: Music[] = [
  { title: "独りんぼエンヴィー", base: 100 }
]

export const defaultMusic = () => Musics[0]

export const findMusic = (title: string) => {
  const index = Musics.findIndex(music => music.title === title)
  return {
    ...Musics[index === -1 ? 0 : index],
    url: jacketURL(index === -1 ? 0 : index)
  }
}

const jacketURL = (index: number) =>
  new URL(`${prefix}${String(index + 1).padStart(4, "0")}${fileext}`, Deno.env.get("BACKET_URL")!).href

const prefix = "jacket_"
const fileext = ".png"