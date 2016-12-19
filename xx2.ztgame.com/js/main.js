var doFn = {
    // 储存第二屏风景图片的数组
    img: [],
    //鼠标滚动 上下箭头键 鼠标点击导航按钮页面切换
    scrollFn: function () {
        // 当前所在屏幕 从0开始
        var onIndex = 0;
        // container的margin-top
        var mt = 0;
        // 是否正在滚动
        var onScroll = false;
        // 计数器
        var timer = null;
        // 默认屏幕高度
        var screenHeight = 734;
        // 新闻弹出层状态
        var newsOut = true;
        // 二屏的图片还未加载
        imgLoad = false;

        function pageTurnHandler() {
            e = event || window.event;
            // 如果没有在滚动 开始滚动 将onScroll设置为true 设置一个1s的倒计时 与css3动画时间一致 滚动完成后将onScroll设置为false
            if (!onScroll) {
                onScroll = true;
                timer = setTimeout(function () {
                    onScroll = false;
                    timer = null;
                }, 800);
                // 滚轮向下滚动event.wheelDelta为负 onIndex++
                if (e.wheelDelta < 0 || e.keyCode == 40) {
                    screenHeight = $(document).height();
                    if (mt > -screenHeight * 4) {
                        onIndex++;
                    }
                }
                // 滚轮向上滚动event.wheelDelta为正 onIndex--
                else if (e.wheelDelta > 0 || e.keyCode == 38) {
                    if (mt < 0) {
                        onIndex--;
                    }
                }
                newsControl();
                setMtAndOn();
            }
        }

        // 新闻控制 不在第一屏的时候自动隐藏
        function newsControl() {
            if (onIndex == 0) {
                newsOut = true;
                newsShow();
                newsToggle();

            } else {
                newsOut = false;
                newsToggle();
                newsHide();
            }
        }

        // 新闻弹出层缩进和弹出动画
        function newsToggle() {
            if (newsOut) {
                $('.news-left').animate({
                    'marginLeft': 0
                }, 300);
            } else {
                $('.news-left').animate({
                    'marginLeft': '-269px'
                }, 300);
            }
        }

        // 新闻弹出层渐隐和展现动画
        function newsHide() {
            $('.news-left').fadeOut(300);
        }

        function newsShow() {
            $('.news-left').fadeIn(300);
        }

        // 给当前所在屏加上class——on，适用于column和nav-right
        function currentOn(className) {
            $(className).removeClass('on');
            switch (onIndex) {
                case 0:
                    $(className).eq(0).addClass('on');
                    break;
                case 1:
                    $(className).eq(1).addClass('on');
                    break;
                case 2:
                    $(className).eq(2).addClass('on');
                    break;
                case 3:
                    $(className).eq(3).addClass('on');
                    break;
                case 4:
                    $(className).eq(4).addClass('on');
                    break;
            }
        }

        // 通过onIndex的值来设置container的margin-top值，并给当前的附上class——on
        function setMtAndOn() {
            screenHeight = $(window).height();
            mt = -screenHeight * onIndex;
            $('.container').animate({
                'margin-top': mt
            }, 800, function () {
                currentOn('.column');
                currentOn('.item');
            });
        }

        //二屏的风景图片加载 加载过一次便不执行了
        function f2imgLoad() {
            if (onIndex === 1 && !imgLoad) {
                $('.f2 area').each(function (index) {
                    doFn.img[index] = new Image();
                    doFn.img[index].src = $(this).attr('data-url');
                });
                imgLoad = true;
            }
        }

        // 点击切换
        $('.news-btn').click(function () {
            newsOut = !newsOut;
            newsToggle();
        });

        // 缩放页面时按照当前可视高度自动调整mt
        $(window).resize(function () {
            setMtAndOn();
        });

        // 点击nav-right切换至对应屏
        $('.nav-right > a').each(function (index) {
            if (index === 5) {
                // 显示新闻面板
                $(this).click(function () {
                    newsShow();
                    newsOut = !newsOut;
                    newsToggle();

                })
            } else {
                $(this).click(function () {
                    onIndex = index;
                    setMtAndOn();
                    newsControl();
                })
            }
        });

        // 给document绑定鼠标滚轮事件、键盘事件、鼠标移动事件
        $(document).on({
            'mousewheel keydown': function (event) {
                pageTurnHandler();
                // 滚动时pause视频，隐藏二屏和视频的弹层
                $('.popup-content').find('video')[0].pause();
                $('.popup-bg').hide();
                f2imgLoad();
            }
        });
    },

    // 花瓣控制函数
    petalsFn: function () {
        // 获取当前各花瓣坐标
        var _l = [];
        var _t = [];
        var _x = 0;
        var _y = 0;
        $('.petals>div').each(function (index) {
            var $self = $(this);
            _l[index] = parseInt($self.css('left'));
            _t[index] = parseInt($self.css('top'));
        });

        // 花瓣随鼠标移动
        function petalsMove() {
            _x = event.pageX;
            _y = event.pageY;
            $('.petals>div').each(function (index) {
                var $self = $(this);
                // 判断偶数花瓣正向移动 奇数花瓣反向移动
                if (index % 2 === 0) {
                    $self.css({
                        'left': _l[index] + _x / 20,
                        'top': _t[index] + _y / 20
                    });
                } else {
                    $self.css({
                        'left': _l[index] - _x / 20,
                        'top': _t[index] - _y / 20
                    });
                }
            });
        }

        $(document).on('mousemove', petalsMove);
    },

    // 第四屏的视频控制函数
    f4VideoFn: function () {
        // 点击四屏按钮显示蒙层播放视频
        $('.f4-btn1').click(function (event) {
            event.preventDefault();
            $('.page4 .popup-bg').show();
            $('.popup-content').find('video')[0].play();
        });

        // 点击关闭按钮暂停视频隐藏蒙层
        $('.close-btn').click(function () {
            event.preventDefault();
            $('.popup-content').find('video')[0].pause();
            $('.page4 .popup-bg').hide();
        });
    },

    // 第二屏图片预览函数
    f2PictureFn: function () {
        var $ul = $('.f2 > ul');
        var uml = 0;

        function setImgSrc() {
            $('.popup-content').find('img').eq(0).attr('src', doFn.img[rel].src);
        }
        // 点击btn1 ul的ml+518px 限定范围 
        $('.tab-btn1').click(function () {
            if (uml >= -1036 && uml < 0) {
                $ul.animate({
                    'marginLeft': '+=518'
                }, 500);
                uml += 518;
            }
        });

        // 点击btn2 ul的ml-518px 限定范围
        $('.tab-btn2').click(function () {
            if (uml <= 0 && uml > -1036) {
                $ul.animate({
                    'marginLeft': '-=518'
                }, 500);
                uml -= 518;
            };
        });

        // 点击area图片预览弹层show
        $('.f2 area').click(function (index) {
            rel = $(this).attr('rel');
            $('.page2 .popup-bg').show();
            setImgSrc()
                //点击左右tab按钮切换图片
            $('.left-tab').click(function () {
                if (rel > 0) {
                    rel--;
                    setImgSrc();
                }
            });
            $('.right-tab').click(function () {
                if (rel < doFn.img.length) {
                    rel++;
                    setImgSrc();
                }
            });
        });

        // 点击关闭按钮隐藏图片预览弹层
        $('.close-btn').click(function () {
            $('.page2 .popup-bg').hide();
        });

    }

}

doFn.scrollFn();
doFn.petalsFn();
doFn.f4VideoFn();
doFn.f2PictureFn();