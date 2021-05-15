import { Logger } from "eazy-logger"
import { createElement } from "react"
import { renderToString } from 'react-dom/server';
import { name, version } from "./package.json"

interface Options {
  verbose?: boolean
}

export const reactPlugin = {
  initArguments: {},
  configFunction: function(eleventyConfig: any, options: Options) {
    const logger = Logger({
      prefix: `[{blue:${name}}@{blue:${version}}] `,
    })

    function compile(src: string, filename: string) {
      return async (props: Object) => {
        const Component = require(
          `${process.cwd()}/${filename}`
        ).default
        const element = createElement(Component, props)
        let html = renderToString(element)
        html = `<!doctype html>${html}`
        html = html.replace(/ data-reactroot=""/, "")
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

