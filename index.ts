import { Logger } from "eazy-logger"
import { buildSync } from "esbuild"
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
      compile(src: string, filename: string) {
        return async (props: Object) => {
          const result = buildSync({
            bundle: true,
            entryPoints: [filename],
            platform: "node",
            format: "iife",
            globalName: "template",
            loader: {
              ".node": "binary",
              ".tsx": "tsx",
            },
            write: false,
          })
          const code = result.outputFiles[0].text
          eval(code)
          // @ts-ignore
          const Component = template.default
          const element = createElement(Component, props)
          let html = renderToString(element)
          html = `<!doctype html>${html}`
          html = html.replace(/ data-reactroot=""/, "")
          return html
        }
      },
    })
  }
}

