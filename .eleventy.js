const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
module.exports = function(eleventyConfig) {
  eleventyConfig.templateFormats = [
    'md',
    'njk',
    'css'
  ]
  eleventyConfig.passthroughFileCopy = true
  eleventyConfig.addPlugin(syntaxHighlight)
}
