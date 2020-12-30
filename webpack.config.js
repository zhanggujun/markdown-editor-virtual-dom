const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const mode = process.env.NODE_ENV

const plugins = () => ([
  new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: 'head'
  }),
  // 热更新插件
  new webpack.HotModuleReplacementPlugin()
])

const baseConfig = options => {
  const {
    entry = './src/index.js',
    filename = 'index.js',
    library = 'MdEditor',
    outpath = 'core'
  } = options || {}
  return {
    mode,
    entry,
    output: {
      path: path.resolve(__dirname, outpath),
      filename,
      library,
      libraryTarget: 'umd',
      umdNamedDefine: true,
      libraryExport: 'default',
    },
    module: {
      rules: [{
        test: /\.(sc|sa|c)ss$/,
        use: [{
          loader: mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          options: {
            insert:'head',
            injectType:'styleTag'
          }
        },{
          loader: 'css-loader'
        },{
          loader: 'sass-loader'
        },{
          loader: 'sass-resources-loader',
          options: {
            resources: path.resolve(__dirname, './src/style/vars.scss')
          }
        },{
          loader: 'postcss-loader'
        }]
      },{
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: `/icon`
          }
        }
      },{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
    }
  }
}

module.exports = [{
  ...baseConfig(),
  devServer:{
    host:'localhost',
    compress: true,
    open: true,
    port: 8891
  },
  plugins: mode === 'development' ? [
    ...plugins(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new OptimizeCSSAssetsPlugin()
  ] : [
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new OptimizeCSSAssetsPlugin()
  ]
},{
  ...baseConfig({
    entry: './src/core/editor.js',
    filename: 'editor.js',
    library: 'MdCreate',
    outpath: 'core'
  })
},{
  ...baseConfig({
    entry: './src/core/markdown.js',
    filename: 'markdown.js',
    library: 'MdMarked',
    outpath: 'core'
  })
}]
