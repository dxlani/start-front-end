require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据
let imageDatas = require('../data/imageDatas.json');

//将图片名称转成图片url路径信息 自执行函数
//此处可能有坑
imageDatas = function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    imageDataArr[i].imageURL = require('../images' + imageDataArr[i].fileName)
  }
  return imageDatasArr;
} (imageDatas);

let imagesURL = require('../')

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
          卧槽
        </section>
        <nav className="controlller-nav">
          导航
        </nav>
      </section>
    );
  }
}

// AppComponent.defaultProps = {
// }; 

export default AppComponent;