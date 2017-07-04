'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),  //检测重复文件并消除
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),  //压缩输出的js代码
    new webpack.optimize.OccurenceOrderPlugin(),  //按引用频率排序各个模块，bundle的id引用越频繁越短，达到性能优化目的
    new webpack.optimize.AggressiveMergingPlugin(),   //优化生成的代码chunk，合并相似chunk，提取公共部分
    new webpack.NoErrorsPlugin()    //保证编译过程不能出错
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
