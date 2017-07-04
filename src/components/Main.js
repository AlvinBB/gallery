require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

let imageDatas = require('../data/imageDatas.json');

//在原有的imageDatas单个对象上加上imgURL补全url
imageDatas = (function genImageURL(imageDatasArr){
  for(let i = 0; i < imageDatasArr.length;i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imgURL =
      require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="controller-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
