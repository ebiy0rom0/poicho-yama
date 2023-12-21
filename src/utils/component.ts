import { ActionRow, ButtonComponent, ButtonStyles, Interaction, InteractionTypes, MessageComponentTypes } from "../deps.ts"

type OptionalProperty<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export const isComponentInteraction = (interaction: Interaction): boolean =>
  interaction.type === InteractionTypes.MessageComponent

export const createActionRow = (components: ActionRow["components"]): ActionRow => ({
  type: MessageComponentTypes.ActionRow,
  components
})

export const createButton = (
  component: OptionalProperty<ButtonComponent, "type">
): ButtonComponent => ({
  ...component,
  type: MessageComponentTypes.Button
})

export const generateCustomID = (id: string, ...values: (number | string)[]): string =>
  `${id}:${values.join(":")}`

export const parseCustomID = (customID: string): [string, ...string[]] => {
  const [id, ...values] = customID.split(":")
  return [id, ...values]
}


// deno-lint-ignore no-explicit-any
export const createPager = (contents: any[], limit: number, currentPage: number, forcedDisable = false, ...params: any[]): ActionRow => {
  const max = Math.ceil(contents.length / limit)
  return createActionRow([
    createButton({
      label: "<",
      style: ButtonStyles.Primary,
      customId: generateCustomID("left", currentPage - 1, ...params),
      disabled: forcedDisable || currentPage === 1,
    }),
    createButton({
      label: `${currentPage}/${max}`,
      style: ButtonStyles.Secondary,
      customId: "page",
      disabled: true
    }),
    createButton({
      label: ">",
      style: ButtonStyles.Primary,
      customId: generateCustomID("right", currentPage + 1, ...params),
      disabled: forcedDisable || currentPage === max
    })
  ])
}