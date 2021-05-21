const { register } = require("ts-node")
const { reactPlugin } = require("../../")

register()

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(reactPlugin, {
    verbose: true,
  })
}