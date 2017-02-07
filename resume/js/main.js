var doFn = {
    // 储存第二屏风景图片的数组
    img: [],
    // 弹幕是否显示
    bar: false,
    // 弹幕滚动定时器
    barTimer: null,

    //鼠标滚动 上下箭头键 鼠标点击导航按钮页面切换
    scrollFn: function () {
        // 当前所在屏幕 从0开始
        var onIndex = 0;
        // container的margin-top
        var mt = 0;
        // 是否正在滚动
        var onScroll = false;
        // 计数器
        var scrTimer = null;
        // 默认屏幕高度
        var clientH = 734;
        // info弹出层状态
        var infoOut = true;
        // 二屏的图片还未加载
        var imgLoad = false;

        function pageTurnHandler() {
            e = event || window.event;
            // 如果没有在滚动 开始滚动 并将onScroll设置为true 
            // 设置一个1s的倒计时 防止频繁出发滚动事件 滚动完成后将onScroll设置为false
            if (!onScroll) {
                onScroll = true;
                scrTimer = setTimeout(function () {
                    onScroll = false;
                    scrTimer = null;
                }, 500);
                // 滚轮向下滚动event.wheelDelta为负 onIndex++
                if (e.wheelDelta < 0 || e.keyCode == 40) {
                    clientH = $(window).height();
                    if (mt > -clientH * 4) {
                        onIndex++;
                    }
                }
                // 滚轮向上滚动event.wheelDelta为正 onIndex--
                else if (e.wheelDelta > 0 || e.keyCode == 38) {
                    if (mt < 0) {
                        onIndex--;
                    }
                }
                whenIndexChange();
            }
        }

        // onIndex改变时的一些逻辑
        function whenIndexChange() {

            setMtAndOn();
            // info控制 不在第一屏的时候自动隐藏
            (function infoControl() {
                if (onIndex === 0) {
                    infoOut = true;
                    $('.info').fadeIn(300);
                    infoToggle();

                } else {
                    infoOut = false;
                    infoToggle();
                    $('.info').fadeOut(300);
                }
            })();

            //二屏的风景图片加载 加载过一次便不执行了
            (function f2imgLoad() {
                if (onIndex === 1 && !imgLoad) {
                    $('.f2 area').each(function (index) {
                        doFn.img[index] = new Image();
                        doFn.img[index].src = $(this).attr('data-url');
                    });
                    imgLoad = true;
                }
            })();

            setMtAndOn();

            // 第四屏看完动画再绑定事件
            if (onIndex === 3) {
                clearTimeout(p4Timer);
                var p4Timer = setTimeout(function () {
                    $('.history').on('mouseover', function () {
                        if ($(this).attr('class').indexOf('cur') < 0) {
                            $('.history').removeClass('cur');
                            $(this).addClass('cur')
                        }
                    });
                }, 2000);
            } else {
                $('.history').off('mouseover');
                $('.history').removeClass('cur').eq(-1).addClass('cur');
            }
        }

        // 通过onIndex的值来设置container的margin-top值，并给当前的附上class——on
        function setMtAndOn() {

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

            clientH = $(window).height();
            mt = -clientH * onIndex;
            $('.container').stop(true, false).animate({
                'margin-top': mt
            }, 500, function () {
                currentOn('.column');
                currentOn('.item');
            });
        };

        // info弹出层缩进和弹出动画 不是完全隐藏会露出一条
        function infoToggle() {
            if (infoOut) {
                $('.info').animate({
                    'marginLeft': 0
                }, 300);
            } else {
                $('.info').animate({
                    'marginLeft': '-350px'
                }, 300);
            }
        }

        // info点击伸缩按钮
        $('.info-tg').click(function () {
            infoOut = !infoOut;
            infoToggle();
        });

        // 缩放页面时按照当前可视高度自动调整mt
        $(window).resize(function () {
            setMtAndOn();
        });

        // 给右侧导航按钮绑定点击事件
        $('.nav-right').find('.item').each(function (index) {
            // 点第六个按钮——先显示info，然后相当于info点击伸缩按钮
            if (index === 5) {
                $(this).click(function () {
                    infoOut = !infoOut;
                    $('.info').fadeIn(300);
                    infoToggle();
                })
            } else {
                $(this).click(function () {
                    onIndex = index;
                    whenIndexChange();
                })
            }
            $(this).hover(function () {
                $(this).find('span').show();
            }, function () {
                $(this).find('span').hide();
            })
        });

        // 给document绑定鼠标滚轮事件、键盘事件、鼠标移动事件
        $(document).on({
            'mousewheel keydown': pageTurnHandler
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

    },
}

doFn.scrollFn();
doFn.f2PictureFn();