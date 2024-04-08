const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    model: './model/index.marko',
    ui: './ui/index.marko',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/bundle')
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.marko'],
    alias: {
      //$: "./node_modules/jquery/src/jquery.js",
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          //{loader: "style!css"}
        ]
      },

      {
        test: /\.marko$/,
        loader: 'marko-loader'
      },

      {
        test: /\.js$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
      },

    ]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    //new UglifyJSPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /it/),
    new webpack.ProvidePlugin({
      'window.Quill': 'quill'
    })
  ]
};