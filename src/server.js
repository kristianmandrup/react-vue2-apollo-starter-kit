import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express from 'express';
import config from './config';

const APP_PORT = 3001;

var compiler = webpack({
  entry: {
    react: path.resolve(__dirname, 'js',  'react', 'app.js'),
    vue: path.resolve(__dirname, 'js',  'vue', 'app.js'),
  },
  // entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/,
      }
    ]
  },
  output: {filename: '[name].app.js', path: '/'}
});

let contentBase = 'src/';
if (process.env.NODE_ENV === "production") {
  contentBase = 'lib/';
}

var app = new WebpackDevServer(compiler, {
  contentBase: contentBase,
  publicPath: '/js/',
  proxy: { '/graphql': config.scapholdUrl },
  stats: {colors: true}
});
// Serve static resources
app.use('/', express.static(path.resolve(__dirname, '/')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
