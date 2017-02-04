require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
var imageDatas = require('json-loader!../data/imageDatas.json');

//将图片名称转成图片url路径信息 自执行函数
imageDatas = ((imageDatasArr) => {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = 'http://ohjk5hfzd.bkt.clouddn.com/movieWall' + singleImageData.fileName;
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

function getRangeRandom(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}


//单个图片组件
class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    }
    else {
      this.props.center();
    }

  }

  render() {

    var styleObj = {};

    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate) {
      styleObj.transform = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 10000;
    }
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse ' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj}
        onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

//图片数字导航
class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    }
    else {
      this.props.center();
    }
  }

  render() {
    var controllerClassName = 'controller-span';
    controllerClassName += this.props.arrange.isCenter ? ' center-span ' : '';
    controllerClassName += this.props.arrange.isInverse ? ' inverse-span ' : '';

    return (
      <span className={controllerClassName} onClick={this.handleClick}></span>
    )
  }
}

//总的组件
class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        // 这个image数组格式是这样滴
        // {
        //   pos:{
        //     left: 0,
        //     top 0:
        //   },
        //   rotate: 0,//旋转角度
        //   isInverse: false, //图片正反面
        //   isCenter: false //图片是否居中
        // },
        // {
        //   pos:{
        //     left: 0,
        //     top 0:
        //   },
        //   rotate: 0,//旋转角度
        //   isInverse: false, //图片正反面
        //   isCenter: false //图片是否居中
        // },
        // ……
      ]
    }
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      // 水平取值范围
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      //垂直取值范围
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    }
  }

  //图片排布的函数
  reArrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var Constant = this.Constant;
    //控制居中图片位置 居中图片存放在centerArr中
    var centerArr = imgsArrangeArr.splice(centerIndex, 1);
    centerArr[0] = {
      pos: Constant.centerPos,
      rotate: 0,
      isInverse: false,
      isCenter: true
    }
    //控制上分区的图片位置 随机生成一到两张放在上面 这个数量存在topImgNum里 位置信息存放在topArr里
    var topImgNum = Math.floor(Math.random() * 2);
    var topFirstImgIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    var topArr = imgsArrangeArr.splice(topFirstImgIndex, topImgNum);
    topArr.forEach((value, index) => {
        topArr[index] = {
          pos: {
            //利用getRangeRandom函数在范围内随机取得xy坐标
            left: getRangeRandom(Constant.vPosRange.x[0], Constant.vPosRange.x[1]),
            top: getRangeRandom(Constant.vPosRange.topY[0], Constant.vPosRange.topY[1])
          },
          rotate: getRangeRandom(-30, 30),
          isCenter: false

        }
    })

    //控制左右分区的图片位置 一边放一半
    for (var i = 0, j = imgsArrangeArr.length; i < j; i++) {
        var leftOrRightX = null; //左右的x轴
        if (i < j / 2) {
            leftOrRightX = Constant.hPosRange.leftSecX; //左
        }
        else {
            leftOrRightX = Constant.hPosRange.rightSecX; //右
        }
    
      imgsArrangeArr[i] = {
          pos: {
              left: getRangeRandom(leftOrRightX[0], leftOrRightX[1]),
              top: getRangeRandom(Constant.hPosRange.y[0], Constant.hPosRange.y[1])
          },
          rotate: getRangeRandom(-30, 30),
          isCenter: false
      }
    }

    //把取出的上和中图片信息放回imgsArrangeArr
    if (topArr && topArr.length > 0) {
        topArr.forEach((value, index) => {
        imgsArrangeArr.splice(topFirstImgIndex, 0, topArr[index]);

      })
    }
    imgsArrangeArr.splice(centerIndex, 0, centerArr[0]);

    //设置组件的state，还原imgsArrangeArr
    this.setState ({
        imgsArrangeArr: imgsArrangeArr
    })
  }

  inverse(index) {
    return () => {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }
  }

  center(index) {
    return () => {
      this.reArrange(index);
    };
  }

  componentDidMount() {

    //获取舞台的大小
    var imgSecDOM = ReactDOM.findDOMNode(this.refs.imgSec);
    var imgSecW = imgSecDOM.scrollWidth;
    var imgSecH = imgSecDOM.scrollHeight;
    var halfimgSecW = Math.ceil(imgSecW / 2);
    var halfimgSecH = Math.ceil(imgSecH / 2);
    //拿到imgFigure的大小 都是一样的so取第一个
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    var imgW = imgFigureDOM.scrollWidth;
    var imgH = imgFigureDOM.scrollHeight;
    var halfImgW = Math.ceil(imgW / 2);
    var halfImgH = Math.ceil(imgH / 2);
    

    //计算中心图片的位置
    this.Constant.centerPos = {
      left: halfimgSecW - halfImgW,
      top: halfimgSecH - halfImgH
    }

    //左右侧图片xy坐标的取值范围
    this.Constant.hPosRange = {
      leftSecX: [-halfImgW, halfimgSecW - halfImgW * 3],
      rightSecX: [halfimgSecW + halfImgW, imgSecW - halfImgW],
      y: [-halfImgH, imgSecH - halfImgH]
    }

    //上分区图片xy坐标的取值范围
    this.Constant.vPosRange = {
      x: [halfimgSecW - imgW, halfimgSecW],
      topY: [-halfImgH, halfimgSecH - halfImgH * 3]
    }

    // 随机一张放在中间
    var n = Math.random() * imageDatas.length;
    this.reArrange(n);

  }


  render() {

    var controllerUnits = [];
    var imgFigures = [];

    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}
        arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)}
        center={this.center(index)} />);
      controllerUnits.push(<Controller key={index} data={index} ref={'controller' + index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)}
        center={this.center(index)} />);
    });

    return (
      <section>
        <section className="img-sec" ref="imgSec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
        <h1 className="main-title">无风的电影墙</h1>
      </section>
    );
  }
}

export default AppComponent;