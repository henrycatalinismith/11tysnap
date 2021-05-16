import { Logger } from "eazy-logger"
import { Module } from "module"
import { createElement } from "react"
import { renderToString } from 'react-dom/server';
import { name, version } from "./package.json"

interface Options {
  verbose?: boolean
}

interface Props {
  collections: Object[]
  pkg: Object
  page: {
    filePathStem: string
    fileSlug: string
    inputPath: string
    outputPath: string | boolean
    url: string
  }
}

export const reactPlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: any, options?: Options) {
    // 11ty's addExtension() API is experimental and only available if this
    // environment variable is set. In order for 11tysnap to require as little
    // configuration as possibl, we just forcibly enable experimental mode in
    // Eleventy here.
    process.env.ELEVENTY_EXPERIMENTAL = "true"

    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    if (!options?.verbose) {
      logger.info = () => {}
    }

    const includePaths = new Set

    function wiretapModules(extension: string) {
      // @ts-expect-error
      const extensions = Module._extensions
      const original = extensions[extension]
      extensions[extension] = (module: any, filename: string) => {
        includePaths.add(filename)
        return original.call(this, module, filename)
      }
    }

    wiretapModules(".jsx")
    wiretapModules(".tsx")

    eleventyConfig.on("beforeBuild", () => {
      includePaths.forEach(includePath => {
        delete require.cache[require.resolve(includePath as string)]
      })
    })

    function compile(src: string, filename: string) {
      return async (props: Props) => {
        if (typeof props.page.outputPath === "boolean") {
          return
        }

        const start = process.hrtime()
        const requirePath = `${process.cwd()}/${filename}`
        const Component = require(requirePath).default
        const element = createElement(Component, props)
        let html = renderToString(element)
        if (props.page.outputPath.endsWith(".html")) {
          html = `<!doctype html>${html}`
        }
        html = html.replace(/ data-reactroot=""/, "")
        const end = process.hrtime(start)
        const time = Math.ceil(end[0] * 1e9 + end[1] / 1e6)
        logger.info([
          "rendered",
          `{green:${filename}}`,
          `[{magenta:${time}ms}]`,
        ].join(" "))
        return html
      }
    }

    const extension = {
      compile,
    }

    eleventyConfig.addExtension("jsx", extension)
    eleventyConfig.addExtension("tsx", extension)

    eleventyConfig.addTemplateFormats("jsx")
    eleventyConfig.addTemplateFormats("tsx")

  }
}
