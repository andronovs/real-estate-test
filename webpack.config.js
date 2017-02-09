var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'source');

var config = {
  devtool: 'eval',
  entry: [
        APP_DIR + '/App.jsx' 
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js', 
    publicPath: '/build/'
  },
  watch: true, 
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        loader : 'babel', 
        exclude: /node_modules/,
        query: {
                presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css'
      },
      { test: /\.json$/, loader: "json-loader" }, 
      { test: /\.png$/, loader: 'file' }, 
      { test: /\.jpg$/, loader: 'file' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file' } 
    ]
  },
  devtool: "source-map", 
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }), 
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ] 
};

module.exports = config;