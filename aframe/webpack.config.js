var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    library: 'AFRAME',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'aframe-master.js'
  },
  devtool: 'source-map',
  mode: 'development',
  devServer: {
    allowedHosts: [
      'localhost',
      '.github.com', // Add your GitHub domain or hostname here
    ],
    host: '0.0.0.0',
    port: 3000 || process.env.PORT,
    hot: false,
    liveReload: true,
    static: {
      directory: 'examples',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.INSPECTOR_VERSION': JSON.stringify(
        process.env.INSPECTOR_VERSION
      )
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  resolve: {
    alias: {
      three: 'super-three'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
          // options: {
          //   presets: ['@babel/preset-env'],
          // },
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
