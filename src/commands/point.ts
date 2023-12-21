import { Messages, T } from "../config/messages.ts"
import { ApplicationCommandOptionTypes } from "../deps.ts"
import { createCommand } from "../utils/command.ts"
import { createEmbed, createEmbedFiled, createEmbedFooter } from "../utils/embed.ts"
import { createPager, parseCustomID } from "../utils/component.ts"
import { PointCalculator } from "../utils/calcurator.ts"
import { InteractionRepository } from "../repositories/interaction.ts"
import { findMusic } from "../config/musics.ts";

const CONTENTS_LIMIT = 10

export default createCommand({
  name: "point",
  description: "独りんぼエンヴィーのポイント獲得表を表示します。",
  options: [
    {
      type: ApplicationCommandOptionTypes.Integer,
      name: "point",
      required: true,
      description: "必要ポイント数",
    }
  ],

  execute: async ctx => {
    const point = ctx.getOption<number>("point")!
    const title = ctx.getOption<string>("music")!
    const music = findMusic(title)

    const calcurator = await PointCalculator.New(music.base)
    const rows = await calcurator.findRows(point)

    const timestamp = await InteractionRepository.setToken(ctx.interaction.guildId!, ctx.interaction.token)

    if (rows.length === 0) {
      await ctx.reply({ content: "not found" })
      return
    }

    await ctx.reply({
      customId: name,
      content: T(Messages.Info, point),
      embeds: [
        createEmbed({
          title: music.title,
          description: `基礎点: ${music.base}`,
          color: 0xffa500,
          fields: generateMessageFields(rows, CONTENTS_LIMIT, 0),
          footer: createEmbedFooter({
            text: "調整頑張ってね～♪"
          })
        })
      ],
      components: [ createPager(rows, CONTENTS_LIMIT, 1, false, music.title, point, timestamp) ]
    })
  },

  executeComponent: async ctx => {
    ctx.replyOnce({})  // empty reply
    const [, currentPage, title, point, timestamp] = parseCustomID(ctx.customID)
    const music = findMusic(title)

    const calcurator = await PointCalculator.New(music.base)
    const rows = await calcurator.findRows(+point)

    const token = await InteractionRepository.getToken(ctx.interaction.guildId!, +timestamp)
    ctx.editOriginalResponse(token.value!, {
      customId: name,
      content: T(Messages.Info, point),
      embeds: [
        createEmbed({
          title: music.title,
          description: `基礎点: ${music.base}`,
          color: 0xffa500,
          fields: generateMessageFields(rows, CONTENTS_LIMIT, +currentPage),
          footer: createEmbedFooter({
            text: "調整頑張ってね～♪"
          })
        })
      ],
      components: [ createPager(rows, CONTENTS_LIMIT, +currentPage, false, music.title, +point, timestamp) ]
    })
  }
})

// deno-lint-ignore no-explicit-any
const generateMessageFields = (contents: any[], limit: number, offset: number) =>
  contents.slice(offset, offset + limit).map(v => createEmbedFiled({
    name: `${v.bonus}%`,
    value: `${String(v.score.toLocaleString())} - ${(v.score + 19999).toLocaleString()}`,
    inline: true,
  }))
