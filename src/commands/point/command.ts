import { Messages, T } from "../../config/messages.ts"
import { ApplicationCommandOptionTypes } from "../../deps.ts"
import { createCommand } from "../../utils/command.ts"
import { createEmbed, createEmbedFooter } from "../../utils/embed.ts"
import { createPager } from "../../utils/component.ts"
import { PointCalculator } from "../../utils/calcurator.ts"
import { InteractionRepository } from "../../repositories/interaction.ts"
import { findMusic } from "../../config/musics.ts"
import { CONTENTS_LIMIT, generateMessageFields } from "../../utils/commands/point.ts"
import { Failure, Success } from "../../structures/utils/result.ts"

const PointCommand = createCommand({
  name: "point",
  description: "独りんぼエンヴィーのポイント獲得表を表示します。",
  options: [
    {
      type: ApplicationCommandOptionTypes.Integer,
      name: "point",
      required: true,
      description: "必要ポイント数",
    },
    {
      type: ApplicationCommandOptionTypes.Boolean,
      name: "test",
      description: "boolean test",
    },
  ],

  execute: async (ctx) => {
    const point = ctx.getOption<number>("point")!
    const title = ctx.getOption<string>("music")!
    const music = findMusic(title)

    const result = await PointCalculator.New(music.base)
    if (!result.ok) {
      return Failure(new Error(""))
    }

    const calcurator = result.value
    const rows = calcurator.findRows(point)

    if (rows.length === 0) {
      await ctx.reply({ content: Messages.NotFound })
      return Failure(new Error("rows not found"))
    }
    const timestamp = await InteractionRepository.setToken(
      ctx.interaction.guildId!,
      ctx.interaction.token,
    )

    if (rows.length === 0) {
      return Failure(new Error(""))
    }
    await ctx.reply({
      customId: name,
      content: T(Messages.Info, point),
      embeds: [
        createEmbed({
          title: music.title,
          description: `基礎点: ${music.base}`,
          color: music.color,
          thumbnail: {
            url: music.url,
          },
          fields: generateMessageFields(rows, CONTENTS_LIMIT, 0),
          footer: createEmbedFooter({
            text: "調整頑張ってね～♪",
          }),
        }),
      ],
      components: [
        createPager(
          rows,
          CONTENTS_LIMIT,
          1,
          false,
          music.title,
          point,
          timestamp,
        ),
      ],
      flags: 1 << 6,
    })

    return Success()
  },
})

export default PointCommand
