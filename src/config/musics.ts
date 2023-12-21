
type Music = {
  title: string
  base: number
}

const Musics: Music[] = [
  { title: "独りんぼエンヴィー", base: 100 }
]

export const defaultMusic = () => Musics[0]

export const findMusic = (title: string) =>
  Musics.find(music => music.title === title) ?? defaultMusic()