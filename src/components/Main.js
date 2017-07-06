require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('../data/imageDatas.json');

//在原有的imageDatas单个对象上加上imgURL补全url
imageDatas = (function genImageURL(imageDatasArr){
  for(let i = 0; i < imageDatasArr.length; i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imgURL =
      require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//图片组件
let ImgFigure = React.createClass({

  //imgFigure点击函数
  handleClick(e) {

    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  },

  render() {

    let styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0，添加旋转角度
    if(this.props.arrange.rotate) {
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach((value) => {
        styleObj[value] =
          `rotate(${this.props.arrange.rotate}deg)`;
      })
    }

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
        imgFigureClassName +=
          this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img
          src={this.props.data.imgURL}
          alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
});

//控制组件
let ControllerUnit = React.createClass({

  handleClick(e) {

    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation();
  },

  render() {

    let controllerUnitClassName = "controller-unit";

    //如果对应的图片居中，则控制按钮居中状态
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += " is-center";

      //如果同时图片翻转
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse"
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
});

//舞台组件
let Stage = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {  //水平方向取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    },
    vPosRange: {  //垂直方向取值范围
      x: [0,0],
      topY: [0,0]
    }
  },

  /*
   * 翻转图片
   * 输入需要翻转的图片的index值
   * 闭包，返回真正被执行的函数
   */
  inverse(index) {
    return () =>{
      let imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  },

  //取范围随机
  getRangeRandom(low,high) {
    return Math.ceil(Math.random() * (high - low) + low);
  },

  //获取随机旋转角度（正负30度）
  getDegRandom() {
    return (Math.random() >0.5?'':'-') + Math.ceil(Math.random() * 30)
  },

  //重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //取一个或者不取

      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    //首先居中centerIndex的图片
    imgsArrangeCenterArr[0] ={
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(
      Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(
      topImgSpliceIndex,topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value,index) => {  //这里imgsArrangeTopArr没有值时不会进入forEach，防止报错
      imgsArrangeTopArr[index] = {
        pos: {
          top: this.getRangeRandom(
            vPosRangeTopY[0],vPosRangeTopY[1]),
          left: this.getRangeRandom(
            vPosRangeX[0],vPosRangeX[1])
        },
        rotate: this.getDegRandom(),
        isCenter: false
      }
    });

    //布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边，右半部分布局右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0],
            hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0],
            hPosRangeLORX[1])
        },
        rotate: this.getDegRandom(),
        isCenter: false
      }
    }

    //处理后再把处理过的上侧和中间区域图片对象塞回数组（注意顺序）
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0,
        imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0,
      imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },

  /*
   * 利用rearange函数居中对应index图片
   * 输入需要居中的图片的index值
   * 闭包，返回真正被执行的函数
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  },

  getInitialState() {
    return {
      imgsArrangeArr: [
        /*{
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false, //图片正反面
          isCenter: false
        }*/
      ]
    }
  },

  componentDidMount() { //加载后为每张图片计算位置范围

    //首先拿到舞台尺寸
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH= Math.ceil(imgH / 2);

    this.Constant.centerPos = {   //计算中心图片的位置
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0)
  },

  render() {

    let styleObj = {
      height: document.documentElement.clientHeight  //获取浏览器高度，设置舞台高度与浏览器高度一致
    }

    let controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach((value,index) => {

      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(
        <ImgFigure
          data={value}
          ref={'imgFigure'+index}
          arrange={this.state.imgsArrangeArr[index]}
          key={index}
          inverse={this.inverse(index)}
          center={this.center(index)}
        />
      );

      controllerUnits.push(
        <ControllerUnit
          arrange={this.state.imgsArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index)}
          key={index}
        />
      )
    });

    return (
      <section className="stage" ref="stage" style={styleObj}>
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

class AppComponent extends React.Component {
  render() {
    return (
      <Stage/>
    )
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
