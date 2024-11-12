const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  entry: "./src/main.ts",
  output:{
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js' //主意这里最终的输出必须是js
  },
  // webpack-dev-server插件,最后打入内存
  devServer: {
    contentBase: './dist',
    open: true
  },
  resolve: {
    "extensions": ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
         test: /\.css$/, //正则配置
         use: ['style-loader', 'css-loader'],// 先执行css-loader, 在执行styleloader
         exclude: [
          path.resolve(__dirname, 'src/components')
         ]
      },
      //局部处理
      {
        test: /\.css$/, //正则配置
        use: ['style-loader', { 
          loader: 'css-loader',
          options: {
            modules:{
              // localIdentName: '[path][name]__[local]--[hash:base64:5]' //官方
              localIdentName: 'kubor-[name]__[local]--[hash:base64:5]'
            }
          }
        }],// 先执行css-loader, 在执行styleloader
        include: [
         path.resolve(__dirname, 'src/components')
        ]
     },
      {
        test: /\.(eot|woff2|woff|ttf|svg)$/,
        use: ['file-loader']
      },
      {
        test:/\.ts$/,
        use: ['ts-loader'],
        exclude: /node_modules/ //忽略这里面的文件
      }
    ]

  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html' //引入模板文件,自动导入
    }),
    new CleanWebpackPlugin() //每次清除无效文件
  ],
  mode: "development"
}