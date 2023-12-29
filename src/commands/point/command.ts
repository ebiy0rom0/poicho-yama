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

const COMMAND_NAME = "point"

const PointCommand = createCommand({
  name: COMMAND_NAME,
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
      name: "hide",
      description: "結果表示を本人のみに表示します。(デフォルト: False)",
    },
  ],

  execute: async (ctx) => {
    const point = ctx.getOption<number>("point")!
    const title = ctx.getOption<string>("music")!
    const hide = ctx.getOption<boolean>("hide") ?? false
    const music = findMusic(title)

    const result = await PointCalculator.New(music.base)
    if (!result.ok) {
      return Failure(result.err)
    }

    const calcurator = result.value
    const rows = calcurator.findRows(point)

    if (rows.length === 0) {
      await ctx.reply({ content: T(Messages.NotFound, point) })
      return Failure(new Error("rows not found"))
    }
    const timestamp = await InteractionRepository.setToken(
      ctx.interaction.guildId!,
      ctx.interaction.token,
    )

    await ctx.reply({
      customId: COMMAND_NAME,
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
      flags: hide ? 1 << 6 : 0,
    })

    return Success()
  },
})

export default PointCommand
