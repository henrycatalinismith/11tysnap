<p align="center">
  <img
    alt="11tysnap"
    src="https://github.com/hendotcat/11tysnap/raw/trunk/11tysnap.svg"
    height="64"
  />
</p>

<p align="center">
  <strong>
    A React SSR plugin for Eleventy
  </strong>
</p>

<p align="center">
  <img
    src="https://github.com/hendotcat/11tysnap/actions/workflows/publish.yml/badge.svg"
    alt="Build status"
  />
</p>

11tysnap is a server-side [React] plugin for [Eleventy]. It lets you hook up
React to do server-side rendering in your Eleventy site without any painful
Webpack or Babel configuration work. Just add the plugin, set up the runtime
JSX/TSX loader of your choice, and start writing Eleventy templates in React
right away.

This plugin deliberately doesn't include any client-side React bundling. If you
really need client-side React then Eleventy might not be the best option
for you. If you really really _really_ need client-side React _and_ Eleventy
then unfortunately this probably isn't the plugin for you.

## Installation

```
yarn add -D @hendotcat/11tysnap react react-dom
```

## Usage

This example uses [`esbuild-register`][esbuild-register]. If you're trying to
set up a React-based Eleventy site for the first time and aren't sure of
yourself yet, `esbuild-register` is your best option: it'll work with both JSX
and TSX without requiring any config of its own apart from the `register()` call
below.

```javascript
const { reactPlugin } = require("@hendotcat/11tysnap")
const { register } = require("esbuild-register/dist/node")

register()

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(reactPlugin)
}
```

If you know what you're doing and you want to use another loader such as
`@babel/node`, `@babel/runner`, `@esbuild/runner`, or `ts-node`, those all work
just fine with 11tysnap too. Check out the [examples] directory to see usage
examples of all of those and more.

## Options

### `verbose`

Pass `verbose: true` to the plugin and it'll output a whole bunch of
information about what it's doing. This is mostly useful for debugging. Please
enable this this option if you're reporting a bug in 11tysnap.

## Error Codes

11tysnap will try to help you set it up properly. If you make a mistake,
it'll try to help you understand. For some mistakes that it can recognize,
it'll print a link in the build output pointing at one of these error codes to
help you troubleshoot.

### `extension-missing`

This error code is generated when you add the plugin to Eleventy without
setting up a way for Node to load your `.jsx` or `.tsx` files.

Double check your `.eleventy.js` against the [usage example](#usage) at the
top of this readme. Have you set up `esbuild-register` using the `register()`
call?

## Contributing

* [Tips][Contributing]
* [Code of Conduct]

## License

[MIT]

[React]: https://reactjs.org
[Eleventy]: https://www.11ty.dev/
[esbuild-register]: https://github.com/egoist/esbuild-register
[examples]: https://github.com/hendotcat/11tysnap/tree/trunk/examples
[Contributing]: https://github.com/hendotcat/11tyhype/blob/trunk/contributing.md
[Code of Conduct]: https://github.com/hendotcat/11tyhype/blob/trunk/code_of_conduct.md
[MIT]: https://github.com/hendotcat/11tyhype/blob/trunk/license
