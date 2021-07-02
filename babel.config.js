module.exports = function (api) {
  api.cache(true)
  const presets = [["@babel/preset-env", {
    "targets": ["> 1%", "last 10 versions", "ie >= 9"],
    "useBuiltIns": "usage",
    "corejs": {
      "forceAllTransforms": true,
      "version": 3,
      "proposals": false
    }
  }]]
  const plugins = [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties"
  ]
  return {
    presets,
    plugins
  }
}
