let StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
let webpack = require('webpack')

const locals = {
    paths: [
        '/'
    ]
};

module.exports = ({

  entry: {
    'main': './server.js'
  },

  plugins: [
    new StaticSiteGeneratorPlugin('main', locals.paths, locals),
    new webpack.NoErrorsPlugin()
    // new ExtractTextPlugin('style.css')
  ],

  output: {
    filename: 'server.js', //sets our output filename to index.js
    path: 'dist', //sets our output directory to dist/
    libraryTarget: 'umd' //nodejs and StaticSiteGeneratorWebpackPlugin require UMD or CommonJS
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue'
      }
    ]
  },

  watch: true

});