# webpack+react构建应用笔记

## 引入模块

### react

该模块用于react基本命令

```javascript
  import React from 'react';
```

### react-dom

该模块用于对dom进行操作

```javascript
  import reactDOM from 'react-dom';
```

## loader相关

### autoprefixer-loader

用于自动添加CSS属性浏览器厂商前缀，适配兼容性，该loader添加在css-loader处理之前

### json-loader

应用中需要使用json文件，因此引入json-loader处理json文件


## View Control Data

### 数据文件

所需数据文件以json文件包装，放置在src/data下，保证数据视图分离
