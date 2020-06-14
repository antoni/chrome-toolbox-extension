const webpack = require("webpack");
const path = require('path');
const glob = require("glob");

const filenameFromPath = path => path.split('/').pop().slice(0, -3)

const baseEntries = {
  popup: path.join(__dirname, 'src/popup.ts'),
  options: path.join(__dirname, 'src/options.ts'),
  background: path.join(__dirname, 'src/background.ts'),
}

const resolveAllEntries = () => {
  let allEntries = {}
  glob.sync("./src/content-scripts/*.ts").forEach(fullTsPath => {
    allEntries['content-scripts/' + filenameFromPath(fullTsPath)] = fullTsPath
  })
  return { ...baseEntries, ...allEntries }
}

module.exports = {
  mode: 'production',
  entry: resolveAllEntries(),
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      exclude: /node_modules/,
      test: /\.tsx?$/,
      loader: 'ts-loader'
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [

    // pack common vendor files
    // new webpack.optimize.CommonsChunkPlugin({
    // chunks: ['popup', 'options', 'vendor'], // omit 'background'
    // name: 'vendor',
    // minChunks: Infinity
    // }),

    // exclude locale files in moment
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  watch: true,
  performance: { hints: false }
};
