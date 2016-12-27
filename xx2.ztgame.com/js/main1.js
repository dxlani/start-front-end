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

    },
    barrageFn: function () {
        var bar = false;
        var timer = null;
        $('.startBar').on('click', function () {
            if (!bar) {
                $('.barrageBox').show();
                $('.tabTxt').text('关闭弹幕');
                // 先执行一次
                randomBar();
                timer = setInterval(randomBar, 1000);
            } else {
                clearInterval(timer);
                $('.barrageBox').hide();
                $('.tabTxt').text('开启弹幕');
            }
            bar = !bar;
        });

        var oIndex = 0;
        var prea = 0;
        var preb = 0;
        var a = 0;
        var b = 0;
        var barTxtArr = [
            '来啊~造作啊~一起摇摆啊~',
            '小姐姐~一起上天吧~',
            '看，天上有猪在飞~',
            '厉害了我的哥！ 抖得累不累',
            '谁来玩  组队 组队',
            '答题好难啊    姨妈难求！！！！',
            '无限飞行？ 加速飞 会御剑吗！',
            '我是仙 修炼多久可以成仙',
            '答题好难  智商不在线啊啊啊啊  跪求鸡和马',
            '前方高能预警，飞行战队准备，非战斗人员撤离',
            '【哔】喘等等福利', '辣么大，这不科学',
            '如果XX更大就是神作了',
            '听说，玩这个游戏的汉子女朋友胸都很大',
            '你那么厉害，咋不上天呢~ ',
            '恩，我上了',
            '迷之抖动，简直鬼畜，23333',
            '游戏我玩还不行吗，您老别晃了',
            '你上你的班，我成我的仙',
            '能玩游戏 就少吵吵 消停点行吗',
            '大哥 干哈呢 来玩会嘛',
            '梦想,就是坚持让你觉得幸福',
            '仙2,就是你圆梦的新手村',
            '神仙 妖怪 ~~~',
            '吃饭睡觉打怪怪~',
            '5555 这游戏什么时候能玩儿？我也要飞！',
            '大哥 天上的风景好么？',
            '大哥你好帅 求带我一起飞',
            '历害了我的仙哥',
            '吓得我不要不要的',
            '这真是太萝莉啦！',
            '羞耻play',
            '弹幕护体',
            '玩个游戏强行上天，心疼天上的兄弟',
            '前方高能预警，这不是演习 ，有仙！',
            '要是仙侠出2就神作了',
            '摄像师晚饭加鸡腿',
            '这边的弹幕由我来承包 求官方给工作',
            '什么东西在天上飞？66666666',
            '这画面我能看一天',
            '你们只多了个游戏 而我们却多了一帮神仙',
            '我上仙班。。'
        ];

        function randomBar() {
            var $thisBar = $("<div class='barrage'><span class='jianjian'></span><span class='txt'></span><span class='jianbing'></span></div>");
            judgeRepA(3, 1);
            judgeRepB(4, 0);
            var clientW = document.documentElement.clientWidth;
            $('.barrageBox').append($thisBar);
            $thisBar.addClass('j' + a).css('bottom', b * 60 + 10).animate({
                'right': clientW
            }, 10000, 'linear', function () {
                this.remove();
            });
            $thisBar.find('.txt').text(barTxtArr[oIndex]);
            if (oIndex >= barTxtArr.length - 1) {
                oIndex = 0;
            } else {
                oIndex++;
            }
        }

        // 随机一个数
        function randomNum(n, m) {
            return parseInt(Math.random() * n + m);
        }

        // 防止和前一次随机重复
        function judgeRepA(n, m) {
            if (a != prea) {
                prea = a;
            } else {
                a = randomNum(n, m);
                judgeRepA(n, m);
            }
        }

        // 防止重复改进版
        function judgeRepB(n, m) {
            do {
                b = randomNum(n, m);
            } while (b === preb);
            preb = b;
        }
    }
}

doFn.scrollFn();
doFn.petalsFn();
doFn.f4VideoFn();
doFn.f2PictureFn();
doFn.barrageFn();