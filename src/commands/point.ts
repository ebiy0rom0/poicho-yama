import { Messages, T } from "../config/messages.ts"
import { ApplicationCommandOptionTypes } from "../deps.ts"
import { createCommand } from "../utils/command.ts"
import { createEmbed } from "../utils/embed.ts"
import { createPager, parseCustomID } from "../utils/component.ts"
import { PointCalculator } from "../utils/calcurator.ts"
import { InteractionRepository } from "../repositories/interaction.ts"

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
    const calcurator = await PointCalculator.New()
    const point = ctx.getOption<number>("point")!
    const combination = await calcurator.findCombination(point)

    const timestamp = await InteractionRepository.setToken(ctx.interaction.guildId!, ctx.interaction.token)

    if (combination.length === 0) {
      await ctx.reply({ content: "not found" })
      return
    }

    await ctx.reply({
      customId: name,
      content: T(Messages.Info, point),
      embeds: [
        createEmbed({
          title: `🦐🦐 ${point}pt`,
          description: generateMessage(combination, CONTENTS_LIMIT, 0),
          color: 0xffa500
        })
      ],
      components: [ createPager(combination, CONTENTS_LIMIT, 1, false, point, timestamp) ]
    })
  },

  executeComponent: async ctx => {
    const calcurator = await PointCalculator.New()
    ctx.replyOnce({})  // empty reply
    const [, currentPage, point, timestamp] = parseCustomID(ctx.customID)
    const combination = await calcurator.findCombination(+point)

    const token = await InteractionRepository.getToken(ctx.interaction.guildId!, +timestamp)
    ctx.editOriginalResponse(token.value!, {
      customId: name,
      content: T(Messages.Info, point),
      embeds: [
        createEmbed({
          title: `🦐🦐 ${point}pt`,
          description: generateMessage(combination, CONTENTS_LIMIT, (+currentPage - 1) * CONTENTS_LIMIT),
          color: 0xffa500
        })
      ],
      components: [ createPager(combination, CONTENTS_LIMIT, +currentPage, false, +point, timestamp) ]
    })
  }
})

// deno-lint-ignore no-explicit-any
const generateMessage = (contents: any[], limit: number, offset: number) =>
  contents.slice(offset, offset + limit).map(v =>
    `${String(v.score.toLocaleString())} ~ ${(v.score + 19999).toLocaleString()} (${v.bonus}%)`
  ).join("\r")
