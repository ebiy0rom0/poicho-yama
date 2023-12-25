const Units: Record<string, number> = {
  UNIT_VIRTUAL_SINGER: 1,
  UNIT_LEONEED: 2,
  UNIT_MORE_MORE_JUMP: 3,
  UNIT_VIVID_BAD_SQUAD: 4,
  UNIT_WONDERLANDS_SHOWTIME: 5,
  UNIT_25_NIGHTCODE: 6,
  UNIT_OHTERS: 99,
} as const

type UnitsType = typeof Units[keyof typeof Units]

const UnitColors: Record<UnitsType, number> = {
  [Units.UNIT_25_NIGHTCODE]: 0xffffff,
} as const

type Music = {
  title: string
  base: number
  url: string
  color: typeof UnitColors[keyof typeof UnitColors]
}

export const findMusic = (title: string): Music => {
  const index = Musics.some((music) => music.title === title)
    ? Musics.findIndex((music) => music.title === title)
    : 0
  const music = Musics[index]

  return {
    ...music,
    url: jacketURL(index),
    color: UnitColors[music.unit],
  }
}

const jacketURL = (index: number) =>
  new URL(
    `${prefix}${String(index + 1).padStart(4, "0")}${fileext}`,
    Deno.env.get("BACKET_URL")!,
  ).href

const prefix = "jacket_"
const fileext = ".png"

const Musics = [
  { title: "独りんぼエンヴィー", base: 100, unit: Units.UNIT_25_NIGHTCODE },
]
