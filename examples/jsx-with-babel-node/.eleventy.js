const { reactPlugin } = require("../../")

module.exports = function(eleventyConfig) {
  eleventyConfig.setFrontMatterParsingOptions({
    delims: ["/*---", "---*/"],
  })
  eleventyConfig.addPlugin(reactPlugin, {
    verbose: true,
  })
}