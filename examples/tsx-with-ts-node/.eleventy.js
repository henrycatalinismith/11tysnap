const { reactPlugin } = require("../../")

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(reactPlugin, {
    verbose: true,
  })
}