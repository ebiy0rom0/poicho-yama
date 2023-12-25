import { Messages, T } from "../../config/messages.ts"
import { findMusic } from "../../config/musics.ts"
import { InteractionRepository } from "../../repositories/interaction.ts"
import { PointCalculator } from "../../utils/calcurator.ts"
import { createExecutor } from "../../utils/command.ts"
import {
  CONTENTS_LIMIT,
  generateMessageFields,
} from "../../utils/commands/point.ts"
import { createPager, parseCustomID } from "../../utils/component.ts"
import { createEmbed, createEmbedFooter } from "../../utils/embed.ts"

const PointExecutor = createExecutor({
  execute: async (ctx) => {
    ctx.replyOnce({}) // empty reply
    const [, currentPage, title, point, timestamp] = parseCustomID(
      ctx.customID,
    )
    const music = findMusic(title)

    const calcurator = await PointCalculator.New(music.base)
    const rows = await calcurator.findRows(+point)

    const token = await InteractionRepository.getOriginalToken(
      ctx.interaction.guildId!,
      +timestamp,
    )
    if (typeof token === "undefined") {
      ctx.reply({
        content: "[ERROR]Original interaction token has expired.",
      })
      return
    }

    // It's possible to recover from the orginal message,
    // but rebuild the message to reduce the number of API requests.
    ctx.editOriginalResponse(token, {
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
          fields: generateMessageFields(
            rows,
            CONTENTS_LIMIT,
            (+currentPage - 1) * CONTENTS_LIMIT,
          ),
          footer: createEmbedFooter({
            text: "調整頑張ってね～♪",
          }),
        }),
      ],
      components: [
        createPager(
          rows,
          CONTENTS_LIMIT,
          +currentPage,
          false,
          music.title,
          +point,
          timestamp,
        ),
      ],
    })
  },
})

export default PointExecutor
