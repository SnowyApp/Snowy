var path = require('path');
var webpack = require('webpack');
 
module.exports = {
  entry: './scripts/index.js',
  output: { path: __dirname, filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  externals: {
    // Use external version of React
    //react: 'React',
    //'react-dom': 'ReactDOM'
  },
    plugins: [
        new webpack.ProvidePlugin({
            d3: 'd3',
            $: 'jquery',
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};
