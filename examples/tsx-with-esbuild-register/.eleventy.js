const { register } = require("esbuild-register/dist/node")
const { reactPlugin } = require("../../")

register()

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(reactPlugin, {
    verbose: true,
  })
}