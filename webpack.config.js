const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const webpack = require('webpack')

const dev = process.env.NODE_ENV

const devServerPlugin = [
  new HtmlWebpackPlugin({
    template: './public/index.html',
    inject: 'head'
  }),
  // 热更新插件
  new webpack.HotModuleReplacementPlugin()
]

const plugins = name => {
  return [
    new MiniCssExtractPlugin({
      filename: name,
    }),
    new OptimizeCSSAssetsPlugin()
  ]
}

module.exports = [{
  mode: dev,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'editor.all.umd.js',
    library: 'MdEditor',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
  module: {
    rules: [{
      test: /\.css$/,
      use:[{
        loader: dev === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
        options: {
          insert:'head',
          injectType:'styleTag'
        }
      },{
        loader: 'css-loader'
      }]
    },{
      test: /\.scss$/,
      use: [{
        loader: dev === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
          outputPath: '/icon'
        }
      }
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  devServer:{
    host:'localhost',
    compress: true,
    open: true,
    port: 8899
  },
  plugins: dev === 'development' ? [ ...devServerPlugin,...plugins('editor.css') ] : [ ...plugins('editor.css') ]
},{
  mode: dev,
  entry: './src/lib/editor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'editor.js',
    library: 'MdCreate',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default'
  },
  module:{
    rules:[{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  plugins: dev === 'development' ? [ ...plugins('editor.css') ] : [ ...plugins('editor.css') ]
},{
  mode: dev,
  entry: './src/lib/marked.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'marked.js',
    library: 'MdMarked',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default'
  },
  module:{
    rules:[{
      test: /\.css$/,
      use:[{
        loader: dev === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
        options: {
          insert:'head',
          injectType:'styleTag'
        }
      },{
        loader: 'css-loader'
      }]
    },{
      test: /\.scss$/,
      use: [{
        loader: dev === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
          outputPath: '/icon'
        }
      }
    },{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
  plugins: dev === 'development' ? [ ...devServerPlugin,...plugins('marked.css') ] : [ ...plugins('marked.css') ]
}]
