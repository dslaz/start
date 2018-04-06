import plugin from '@start/plugin/src/'

export default (value: string, message?: string) =>
  plugin('assert', async ({ files }) => {
    const { default: assertLib } = await import('assert')

    assertLib(value, message)

    return files
  })