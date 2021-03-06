import { Logger } from "eazy-logger"
import { Module } from "module"
import path from "path"
import { createElement } from "react"
import { renderToString } from 'react-dom/server';
import { name, version, homepage } from "./package.json"

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

    const requirePaths = new Set<string>()
    const watchedPaths = new Set<string>()

    function wiretapModules(extension: string) {
      // @ts-expect-error
      const extensions = Module._extensions
      const original = extensions[extension]
      extensions[extension] = (module: any, filename: string) => {
        requirePaths.add(filename)

        if (typeof original === 'undefined') {
          logger.error("{red:error: extension-missing}")
          logger.error(`{red:unable to load ${path.relative(
            process.cwd(),
            filename,
          )} due to missing ${
            path.extname(filename)
          } extension}`)
          logger.error("{red:for more details, see:}")
          logger.error(`{red:${homepage}/#extension-missing}`)
          process.exit(-1)
        }

        return original.call(this, module, filename)
      }
    }

    wiretapModules(".jsx")
    wiretapModules(".tsx")

    eleventyConfig.on("beforeBuild", () => {
      requirePaths.forEach(includePath => {
        delete require.cache[require.resolve(includePath as string)]
      })
    })

    eleventyConfig.on("afterBuild", () => {
      const watchTargets = new Set(
        [...requirePaths].filter(p => !watchedPaths.has(p))
      )
      watchTargets.forEach(p => {
        eleventyConfig.addWatchTarget(p)
        watchedPaths.add(p)
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
        let html: string

        try {
          html = renderToString(element)
        } catch (e) {
          logger.error("{red:error: render-error}")
          logger.error(`{red:unable to render ${path.relative(
            process.cwd(),
            filename,
          )}}`)
          e.stack.split(/\n/).forEach(line => {
            logger.error(`{red:${line}}`)
          })
          logger.error("{red:for more details, see:}")
          logger.error(`{red:${homepage}/#render-error}`)

          if (!process.argv.includes("--serve")) {
            process.exit(-1)
          }
        }

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
