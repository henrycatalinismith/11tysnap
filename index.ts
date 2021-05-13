import { Logger } from "eazy-logger"
import { transformSync } from "esbuild"
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

    eleventyConfig.addTemplateFormats("tsx")
    eleventyConfig.addExtension("tsx", {
      compile(src: string) {
        return async (props: Object) => {
          const result = transformSync(src, {
            loader: "tsx",
            format: "cjs",
          })
          eval(result.code)
          const Component = exports.default
          const element = createElement(Component, props)
          const html = renderToString(element)
          return html
        }
      },
    })
  }
}

