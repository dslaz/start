import plugin from '@start/plugin/src/'

type Options = {
  processes?: number
}

export default (taskNames: string[], options: Options = {}) => (...args: string[]) =>
  plugin('parallel', async ({ files }) => {
    const { default: execa } = await import('execa')
    const { default: pAll } = await import('p-all')

    const spawnOptions = {
      stdout: process.stdout,
      stderr: process.stderr,
      stripEof: false,
      env: {
        FORCE_COLOR: '1'
      }
    }
    const pAllOptions = {
      concurrency: options.processes || Infinity
    }

    return pAll(
      taskNames.map((taskName) => {
        const spawnCommand = process.argv[0]
        const spawnArgs = [process.argv[1], taskName, ...args]

        return () => execa(spawnCommand, spawnArgs, spawnOptions).catch(() => Promise.reject(null))
      }),
      pAllOptions
    ).then(() => files)
  })
