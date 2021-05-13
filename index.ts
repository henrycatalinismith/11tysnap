import { Logger } from "eazy-logger"
import esbuild from "esbuild"
import { name, version } from "./package.json"

interface Options {
  verbose?: boolean
}

export const snapPlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: any, options: Options) {
    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    if (!options.verbose) {
      logger.info = () => {}
    }

    eleventyConfig.addTemplateFormats("tsx")
    eleventyConfig.addExtension("tsx", {
      read: false,
      getData: true,
      getInstanceFromInputPath(inputPath) {
        return require(`${process.cwd()}/${inputPath}`).default
      },

    })
  }
}

