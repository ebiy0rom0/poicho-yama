import { Messages, T } from "../../config/messages.ts"
import { findMusic } from "../../config/musics.ts"
import { InteractionRepository } from "../../repositories/interaction.ts"
import { InteractionContextWithToken } from "../../structures/commands/interactionContext.ts"
import { Failure, Success } from "../../structures/utils/result.ts"
import { PointCalculator } from "../../utils/calcurator.ts"
import { createExecutor } from "../../utils/command.ts"
import { CONTENTS_LIMIT, generateMessageFields } from "../../utils/commands/point.ts"
import { createPager, parseCustomID } from "../../utils/component.ts"
import { createEmbed, createEmbedFooter } from "../../utils/embed.ts"

const PointExecutor = createExecutor({
  execute: async (ctx) => {
    ctx.replyOnce({}) // empty reply
    const [, currentPage, title, point, timestamp] = parseCustomID(
      ctx.customID,
    )
    const music = findMusic(title)

    const result = await PointCalculator.New(music.base)
    if (!result.ok) {
      return Failure(result.err)
    }

    const calcurator = result.value
    const rows = calcurator.findRows(+point)
    // For pager operation, omit the check since it's always present.

    const token = await InteractionRepository.getOriginalToken(
      ctx.interaction.guildId!,
      +timestamp,
    )
    if (typeof token === "undefined") {
      ctx.reply({ content: Messages.ExpiredToken })
      return Failure(new Error("token is expired."))
    }

    // It's possible to recover from the orginal message,
    // but rebuild the message to reduce the number of API requests.
    const tctx = new InteractionContextWithToken(token)
    tctx.editOriginalResponse({
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
    return Success()
  },
})

export default PointExecutor
