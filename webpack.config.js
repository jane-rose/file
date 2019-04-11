const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
 //打包的css拆分,将一部分抽离出来
const CleanWebpackPlugin  = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader'
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'less-loader'
          ]
        })
      },
      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',// 这里表示不提取的时候，使用什么样的配置来处理css
          use: [
            {
              loader:'css-loader'
            }

          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".json", ".jsx", ".less", ".css"],
    alias: {
      utils: path.resolve(__dirname, "src/utils"),
      '@': path.resolve(__dirname, "src")
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({//将模板的头部和尾部添加css和js模板,dist 目录发布到服务器上，项目包。可以直接上线
      title: 'file upload',
      // file: 'index.html', //打造单页面运用 最后运行的不是这个
      template: 'src/index.html'
    }),
    new ExtractTextPlugin('[name].css'),
    //3、 在plugins中配置属性 ,配置提取出来的css名称
    new CopyWebpackPlugin([
      {from: __dirname+'/src/assects', to: __dirname+'/dist/img',}
    ]),
    new webpack.ProvidePlugin({
      //引用框架 jquery  lodash工具库是很多组件会复用的，省去了import
      '_' : 'lodash'
    })
  ]
};
