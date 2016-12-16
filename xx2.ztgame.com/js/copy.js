/*
 * Created by huangfahui on 2015/4/28.
 */
$(document).ready(function () {
    doFn.init();
});
var doFn = {
    winWid: 0,
    winHei: 0,
    //新闻展开控制
    mr: -264,
    init: function () {
        var self = this;
        self.winWid = $(window).width();
        self.winHei = $(window).height();
        //给flipPop传递this
        self.flipPop.new_self(self);
        //监听页面大小改变
        window.onresize = function () {
            self.winWid = $(window).width();
            self.winHei = $(window).height();
            self.setHeight(['wrap', 'column']);
        };
    },
    setHeight: function (classArr) {
        var self = this;
        var len = classArr.length;
        for (var i = 0; i < len; i++) {
            $('.' + classArr[i]).css('height', self.winHei + 'px');
        };
    },
    //滚动鼠标和点击切换页面
    changePage: function (_class, navclass) {
        var self = this;
        var dom = $('.' + _class);
        var len = dom.children().length;
        var navDom = $('.' + navclass);
        var navLen = navDom.children().length;
        var _indexs = 0;
        var _is = true;
        //单次滚动控制
        var isScroll = true;
        //w3c
        if (document.addEventListener) {
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        };
        //IE/Opera/Chrome
        window.onmousewheel = document.onmousewheel = scrollFunc;
        //鼠标点击事件,只有往下走
        /*$('.column').on('mousedown',function(){
            dodown();
        });*/
        //按上下键翻页
        /* document.onkeydown = window.onkeydown = keyevents;
         if(window.attachEvent){
             window.attachEvent('onkeydown',keyevents);
         }*/
        $(document).on('keydown', function (e) {
            keyevents(e)
        });

        function keyevents(e) {
            var e = e || event;
            var _key = window.event ? e.keyCode : e.which;
            //if(_is){
            _is = false;
            if ((_key == 38)) {
                doup();
            };
            if (_key == 40) {
                dodown();
            };
            //}
        };
        //导航控制翻页
        navDom.children().on('click', function () {
            var __i = $(this).index();
            //console.log(_indexs);
            if (__i >= (navLen - 1)) {
                return false;
            }
            _indexs = __i;
            scFn();
        });

        //判断方向
        function scrollFunc(e) {
            //1：top,2:bottom
            var direct = 0;
            e = e || window.event;
            //单次滚动控制
            if (isScroll) {
                isScroll = false;
                //判断浏览器IE，谷歌滑轮事件 
                if (e.wheelDelta) {
                    //当滑轮向上滚动时
                    if (e.wheelDelta > 0) {
                        direct = 1;
                    }
                    //当滑轮向下滚动时
                    if (e.wheelDelta < 0) {
                        direct = 2;
                    }
                }
                //Firefox滑轮事件
                else if (e.detail) {
                    //当滑轮向上滚动时  
                    if (e.detail < 0) {
                        direct = 1;
                    }
                    //当滑轮向下滚动时
                    if (e.detail > 0) {
                        direct = 2;
                    }
                };

                //通过结果执行切换
                if (direct == 1) {
                    doup();

                } else if (direct == 2) {
                    dodown();
                };
            };
        };

        //触发往上
        function doup() {
            _indexs--;
            if (_indexs < 0) {
                _indexs = 0;
                isScroll = true;
                _is = true;
                return false;
            };
            scFn();
        };
        //触发往下
        function dodown() {
            _indexs++;
            //console.log(_indexs);
            if (_indexs >= len) {
                _indexs = (len - 1);
                isScroll = true;
                _is = true;
                return false;
            };

            scFn();
        };
        //滚动效果
        function scFn() {
            //dom.eq(_indexs-1).css('top','0px');
            /*dom.eq(_indexs).stop().animate({'top':'0px'}, 1000,'swing',function(){
                isScroll = true;
                dom.removeClass('on');
                $(this).addClass('on');
            });*/
            //滚动到第二屏，加载图片
            if (_indexs == 1) {
                self.loadingPage2Img('bnImgList area');
            };

            navDom.children().removeClass('on').eq(_indexs).addClass('on');
            if (_indexs == 0) {
                $('.rightNews').fadeIn();
                $('.navRight').fadeOut();
            } else {
                $('.rightNews').fadeOut();
                $('.navRight').fadeIn();
            };

            var mt = -1 * self.winHei * _indexs;
            dom.stop().animate({
                'marginTop': mt + 'px'
            }, 1000, 'swing', function () {
                isScroll = true;
                dom.children().removeClass('on');
                dom.children().eq(_indexs).addClass('on');
                _is = true;
            });

        };
    },
    //左右按钮切换
    leftRightTab: function (upBtn, downBtn, tabCon) {
        var _index = 0;
        var type = 1;
        var dom = $('.' + tabCon);
        var len = dom.children().length;
        var oneWid = parseInt(dom.children().first().width());

        $('.' + upBtn).on('click', function () {
            type = 1;
            changeFn(type);
        });
        $('.' + downBtn).on('click', function () {
            type = 2;
            changeFn(type);
        });

        function changeFn(type) {
            if (type == 1) {
                _index--;
            }
            if (type == 2) {
                _index++;
            }

            if (_index < 0) {
                _index = 0;
                return false;
            } else if (_index > (len - 1)) {
                _index = len - 1;
                return false;
            };
            var vue = -1 * _index * oneWid;
            dom.stop().animate({
                'marginLeft': vue + 'px'
            }, 500);
        };
    },

    //图片预览效果
    imgView: function (triggerClass, imgConClass, _btn) {
        var self = this;
        var imgObj;
        var triggerClass = $('.' + triggerClass);
        var imgConClass = $('.' + imgConClass);
        var _btn = $('.' + _btn);
        var _index = 0;
        var isLoad = false;

        //给图片预览添加高度
        var _width = parseInt($('.imgViewPop').width());
        var _height = _width * 0.5625;
        $('.imgViewPop').css({
            'height': _height + 'px',
            'marginTop': -_height / 2 + 'px'
        });

        var len = triggerClass.length;
        var imgUrlArr = [];
        for (var i = 0; i < len; i++) {
            imgUrlArr.push(triggerClass.eq(i).attr('data-img'));
        };

        function loadImg(_index_n) {
            //$('.loading').fadeIn();
            //$('.imgViewPop .zz').fadeIn();
            //加载当前图片
            imgObj = new Image();
            imgObj.src = imgUrlArr[_index_n];
            //alert(imgUrlArr);
            // 如果图片已经存在于浏览器缓存，直接调用回调函数
            if (imgObj.complete) {
                //$('.loading').fadeOut();
                //$('.imgViewPop .zz').fadeOut();
                imgConClass.attr('src', imgUrlArr[_index_n]);
                isLoad = false;
                return false;
            };
            imgObj.onload = function () {
                //alert(1);
                imgConClass.attr('src', imgUrlArr[_index_n]);
                isLoad = false;
            };
        };

        triggerClass.on('click', function () {
            _index = $(this).attr('rel') - 1;
            self.showPop('imgViewPop');
            //调用加载
            loadImg(_index);
        });
        _btn.on('click', function () {
            var _this = $(this);
            if (!isLoad) {
                isLoad = true;
                if ((_this.attr('class')).indexOf('up') != -1) {
                    _index--;
                    if (_index < 0) {
                        _index = 0;
                        isLoad = false;
                        return false;
                    }
                } else {
                    _index++;
                    if (_index >= len) {
                        _index = (len - 1);
                        isLoad = false;
                        return false;
                    }
                };
                //调用加载
                loadImg(_index);
            }

        });

    },
    //space后播放图片
    spacePlay: function (path) {
        var self = this;
        var imgArr = [];
        var imgObj, imgStr;
        var _bw = self.bw();
        var flashdom;
        var __i = true;
        //loadImg
        /*for(var i = 15;i<=70;i++){
            imgStr = path+i+'.jpg';
            imgArr.push(imgStr);
            loadImg(imgStr);
        };*/


        /*document.onkeyup = window.onkeyup = keyevent;
        if(window.attachEvent){
            window.attachEvent('onkeyup',keyevent);
        }*/
        $('.spacebtn').on('click', function () {
            if (_is) {
                _is = false;
                //播放图片
                playImg();
            }
        });
        $(document).on('keyup', function (e) {
            keyevent(e)
        });

        function keyevent(e) {
            var e = e || event;
            var _key = window.event ? e.keyCode : e.which;
            if ((_key == 32) && $('.row3.on').length) {
                if (_is) {
                    _is = false;
                    //播放图片
                    playImg();
                }
            };
        };

        function playImg() {
            var imgdom = $('.row3.on .bgimg');
            var zz = $('.row3.on .zz');
            var _box = $('.row3.on .box');
            var j = 0;
            //无内容，插入结构
            if ($('#flashBox').children().length <= 0) {
                self.videoInsert();
            };
            //轮寻dom对象和开始播放
            var tr11 = setInterval(function () {
                //获取视频对象
                if (_bw.isIE6 || _bw.isIE7 || _bw.isIE8) {
                    flashdom = document.getElementById('fl_obj');
                } else {
                    //flashdom = document.getElementById('fl_embed');
                    flashdom = (document.getElementById('flashBox')).getElementsByTagName('embed')[0];
                };
                //console.log(flashdom);
                if (!!flashdom) {
                    clearInterval(tr11);
                    doPlayVideo();
                }
            }, 60);
            //播放
            function doPlayVideo() {
                if (__i) {
                    zz.fadeOut();
                    _box.fadeOut();
                    imgdom.fadeOut();
                    flashdom.startPlay();
                } else {
                    flashdom.rePlay();
                    setTimeout(function () {
                        zz.fadeOut();
                        _box.fadeOut();
                        imgdom.fadeOut();
                    }, 200);
                };
                __i = false;
            }
            /*var timer = setInterval(function(){
                imgdom.attr('src',imgArr[j]);
                j++;
                if(j>imgArr.length){
                    clearInterval(timer);
                    _is = true;
                    return false;
                };
            },40);*/
        };

        function loadImg(url) {
            //加载当前图片
            imgObj = new Image();
            imgObj.src = url
                //alert(imgUrlArr);
            imgObj.onload = function () {};
        };
    },
    controlPop: function (btn, pop) {
        $('.' + btn).on('click', function () {
            $('.popBg').fadeIn();
            $('.' + pop).fadeIn();
        });
        $('.closePop').on('click', function () {
            $('.' + pop).fadeOut();
            $('.popBg').fadeOut();
        });
    },
    showPop: function (_class) {
        $('.' + _class).fadeIn();
        $('.popBg').fadeIn();
    },
    hidePop: function () {
        $('.closePop').on('click', function () {
            $('.pop').fadeOut();
            $('.popBg').fadeOut();
        });
    },
    //显示右新闻
    showNews: function (_btn, _class) {
        var self = this;
        var dom = $('.' + _class);
        var btn = $('.' + _btn);
        //0
        var r = parseInt(dom.css('right'));

        btn.on('click', function () {
            dom.show();
            dom.stop().animate({
                'right': self.mr + 'px'
            }, 500, function () {
                //动画完成后判断是否要隐藏
                /*if(self.mr && $('.row0.on').length){
                    dom.fadeOut();
                };*/
            });
            self.mr = self.mr ? 0 : -264;
        });
    },
    //按钮单独控制显示新闻
    showNewsOnly: function (_btn, _class) {
        var self = this;
        var dom = $('.' + _class);
        var btn = $('.' + _btn);

        btn.on('click', function () {
            self.mr = -264;
            dom.css('right', '-264px');
            dom.show();
            dom.stop().animate({
                'right': '0px'
            }, 500);
        });
    },
    //移动鼠标产生移动效果
    //移动鼠标 ，碎片小位移
    moves: function (_class) {
        var self = this;
        var doms = $('.' + _class);
        var len = doms.children().length;
        var locations = [];
        var str = {};
        var timer2;
        //获取每个元素的top和left
        for (var i = 0; i < len; i++) {
            var _l = parseInt(doms.children().eq(i).css('left'));
            var _t = parseInt(doms.children().eq(i).css('top'));
            str = {
                'top': _t,
                'left': _l
            };
            locations.push(str);
        };

        //设置默认对比的位置
        var c_point_x = 1000;
        var c_point_y = 500;
        //设置元素位置改变的比例
        //[0.06,-0.05,0.1,-0.1,0.05]
        var bk_speed = [];
        for (var i = 0; i < 5; i++) {
            var _unit = parseInt(Math.random() * 10 + 1)
            var _rd = ((_unit > 5) ? 1 : -1) * parseInt(Math.random() * 10 + 1) / 100;
            bk_speed.push(_rd);
        };
        //console.log(bk_speed);
        //计算碎片变化量
        function doPositon(mouse, c_point, speeds) {
            return ((mouse - c_point) * speeds);
        }
        $('.row2').on('mousemove', function (e) {
            e = e || window.event;
            var x, y;
            if (e.pageX || e.pageY) {
                x = e.pageX, y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y = e.clientY + document.body.scrollTop - document.body.clientTop;
            };

            //获取每个元素的top和left
            for (var j = 0; j < len; j++) {
                doms.children().eq(j).css({
                    'left': locations[j].left + doPositon(x, c_point_x, bk_speed[j]) + 'px',
                    'top': locations[j].top + doPositon(y, c_point_y, bk_speed[j]) + 'px'
                });
            };

        });
    },
    //移动鼠标 ，碎片小位移(位移量大一些)
    moves2: function (_class) {
        var self = this;
        var doms = $('.' + _class);
        var len = doms.children().length;
        var locations = [];
        var str = {};
        var timer2;
        //设置小碎片css3延时位移
        doms.addClass('ts');
        //获取每个元素的top和left
        for (var i = 0; i < len; i++) {
            var _l = parseInt(doms.children().eq(i).css('left'));
            var _t = parseInt(doms.children().eq(i).css('top'));
            str = {
                'top': _t,
                'left': _l
            };
            locations.push(str);
        };

        //设置默认对比的位置
        var c_point_x = 1000;
        var c_point_y = 500;
        //设置元素位置改变的比例
        //[0.06,-0.05,0.1,-0.1,0.05]
        var bk_speed = [];
        for (var i = 0; i < 5; i++) {
            var _unit = parseInt(Math.random() * 10 + 1)
            var _rd = ((_unit > 5) ? 1 : -1) * parseInt(Math.random() * 10 + 1) / 50;
            bk_speed.push(_rd);
        };
        //console.log(bk_speed);
        //计算碎片变化量
        function doPositon(mouse, c_point, speeds) {
            return ((mouse - c_point) * speeds);
        };
        //记录移动的值
        var moveArr = [];
        $('.row2').on('mousemove', function (e) {
            e = e || window.event;
            var x, y;
            if (e.pageX || e.pageY) {
                x = e.pageX, y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y = e.clientY + document.body.scrollTop - document.body.clientTop;
            };

            //延时启动位移函数函数
            if (moveArr.length == 0) {
                setTimeout(doMoves());
            }
            //setTimeout(function(){
            moveArr.push({
                'x': x,
                'y': y
            });
            //},60);
            //clearTimeout(timer2);
            //timer2 = setTimeout(function(){
            //获取每个元素的top和left
            /*for(var j = 0;j<len;j++){
                doms.children().eq(j).css({'left':locations[j].left + doPositon(x,c_point_x,bk_speed[j]) + 'px','top':locations[j].top + doPositon(y,c_point_y,bk_speed[j]) + 'px'});
            };*/
            //},500);
        });

        function doMoves() {
            var oldlen = moveArr.length;
            var i = 0,
                maxv = 1000;
            var timer3 = setInterval(function () {
                if (oldlen == moveArr.length) {
                    console.log('停止了');
                    clearInterval(timer3);
                    maxv = moveArr.length;
                } else {
                    oldlen = moveArr.length;
                };

                for (var j = 0; j < len; j++) {
                    doms.children().eq(j).css({
                        'left': locations[j].left + doPositon(moveArr[i].x, c_point_x, bk_speed[j]) + 'px',
                        'top': locations[j].top + doPositon(moveArr[i].y, c_point_y, bk_speed[j]) + 'px'
                    });
                };
                i++;
                if (i >= (maxv - 1)) {
                    moveArr = [];
                    clearInterval(timer3);
                }
            }, 100);
        }
    },
    loadingPage2Img: function (triggerClass) {
        var self = this;
        var imgObj;
        var triggerClass = $('.' + triggerClass);

        var len = triggerClass.length;
        var imgUrlArr = '';
        for (var i = 0; i < len; i++) {
            imgUrlArr = triggerClass.eq(i).attr('data-img');
            loadImg(imgUrlArr);
        };

        function loadImg(url) {
            //加载当前图片
            imgObj = new Image();
            imgObj.src = url;
            //alert(imgUrlArr);
            imgObj.onload = function () {};
        };
    },
    //播放视频
    doAllMove: function () {
        var self = this;
        var moveUrlDom = $('#openVideoBtn');

        //只单独使用click，不然在m下会触发两次
        moveUrlDom.on('click', function () {
            var url = $(this).attr('data-url');
            $('.tan_box,.popBg').fadeIn();
            //关闭按钮
            $("#video_close").click(function () {
                $("#video_wrap").empty();
                $('.tan_box,.popBg').fadeOut();
            });
            //调用播放器
            url = url == undefined ? '' : url;
            $('#video_wrap').gplayer({
                file: url,
                width: '952',
                height: '531',
                auto: true
            });
        })
    },
    //点击top返回顶部
    doGoTop: function (className) {
        var _this = $('.' + className);
        _this.on('click', function () {
            $('html,body').animate({
                'scrollTop': '0px'
            }, 500);
        })
    },
    //滚动时设置top的位置，且在一定位置显示
    rollGoTop: function (className, hei) {
        var self = this;
        var _this = $('.' + className);
        var winHei = $(window).height();
        //console.log(winHei);
        $(window).scroll(function (ev) {
            var scrollTops = $(document).scrollTop();
            //console.log(scrollTops);
            if ((scrollTops + winHei) >= hei) {
                _this.addClass('on');
                //var kk = scrollTops+winHei-hei;
                _this.stop().animate({
                    'top': 100 + scrollTops + 'px'
                }, 5);
            } else {
                _this.removeClass('on');
            }
        });

        self.doGoTop(className);
    },
    //判断字符串在数组index
    arrOf: function (arr, str) {
        // 如果可以的话，调用原生方法
        if (arr && arr.indexOf) {
            return arr.indexOf(str);
        };

        var len = arr.length;
        for (var i = 0; i < len; i++) {
            // 定位该元素位置
            if (arr[i] == str) {
                return i;
            }
        };

        // 数组中不存在该元素
        return -1;
    },
    bw: function () {
        var UserAgent = navigator.userAgent.toLowerCase();
        var jsons = {
            isUc: /ucweb/.test(UserAgent), // UC浏览器
            isChrome: /chrome/.test(UserAgent.substr(-33, 6)), // Chrome浏览器
            isFirefox: /firefox/.test(UserAgent), // 火狐浏览器
            isOpera: /opera/.test(UserAgent), // Opera浏览器
            isSafire: /safari/.test(UserAgent) && !/chrome/.test(UserAgent), // safire浏览器
            is360: /360se/.test(UserAgent), // 360浏览器
            isBaidu: /bidubrowser/.test(UserAgent), // 百度浏览器
            isSougou: /metasr/.test(UserAgent), // 搜狗浏览器
            isIE6: /msie 6.0/.test(UserAgent), // IE6
            isIE7: /msie 7.0/.test(UserAgent), // IE7
            isIE8: /msie 8.0/.test(UserAgent), // IE8
            isIE9: /msie 9.0/.test(UserAgent), // IE9
            isIE10: /msie 10.0/.test(UserAgent), // IE10
            isIE11: /msie 11.0/.test(UserAgent), // IE11
            isLB: /lbbrowser/.test(UserAgent), // 猎豹浏览器
            　　isWX: /micromessenger/.test(UserAgent), // 微信内置浏览器
            isQQ: /qqbrowser/.test(UserAgent) // QQ浏览器
        };
        return jsons;
    },
    //ie6-9兼容处理
    ieSet: function () {
        var self = this;
        /*if(self.bw().isIE6 || self.bw().isIE7 || self.bw().isIE8 || self.bw().isIE9){
        };*/
        if (self.bw().isIE8) {
            $('.row0 .logo').css('top', '-80px');
            $('.row0 .slogan').css('top', '-30px');
            $('.row0 .robCodeBox').css('top', '580px');
        }
    },
    loadImg: function (url) {
        //加载当前图片
        var imgObj = new Image();
        imgObj.src = url;
        //alert(imgUrlArr);
        imgObj.onload = function () {};
    },
    flipPop: {
        new_self: function (_this) {
            this._self = _this;
        },
        init: function (_arr) {
            var self = this;
            //容器
            self.flipId = $('#commentCanvas');
            //容器高度
            self.boxHei = $('#rollTxt').height();
            self.winWid = $(window).width();
            self.winHei = $(window).height();
            //设置每个元素的占位
            self.domSpace = 60;
            //轨道数
            self.orbit = 4;
            //随机生成元素的速度
            self.ranSpeed = 1500;
            //元素移动的速度(在屏幕上生存的时间)
            self.liveTime = {
                'max': 25000,
                'min': 18000
            };
            //记录定时器
            self._timer = null;
            //数组索引
            self._index = 0;
            //纪录当前索引
            self.emNum = 0;
            //随机数纪录值
            self.oldy = 0;
            self.popTxtArr = [
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
            //控制按钮发布弹幕
            self.btnControl();
            //随机发送弹幕
            //self.ranPopEven();
        },
        //按钮功能控制
        btnControl: function () {
            var self = this;
            var tag = true;
            var tag2 = true;
            //控制单次回车
            var keyTag = true;
            //显示发布窗口
            $('.showMsgBtn').on('click', function () {
                if (tag2) {
                    $('.setMsg').fadeIn();
                } else {
                    $('.setMsg').fadeOut();
                };
                tag2 = !tag2;
            });
            $('.closeMsg').on('click', function () {
                if (tag) {
                    clearInterval(_timer);
                    $('.closeMsg').addClass('open');
                    $('.closeMsg').html('打开弹幕');
                    $('.row0 .rollMsgBox').fadeOut();
                    $('.setMsg').fadeOut();
                } else {
                    $('.closeMsg').removeClass('open');
                    $('.closeMsg').html('关闭弹幕');
                    $('.row0 .rollMsgBox').fadeIn();
                    clearInterval(_timer);
                    _timer = setInterval(function () {
                        initRollDom();
                    }, 1500);
                }
                tag = !tag;

            });
            //按钮发布
            $('.setMsgBtn').on('click', function () {
                eveSetPop();
            });
            //键盘回车发布
            $(document).on('keyup', function (e) {
                var e = e || event;
                var _key = window.event ? e.keyCode : e.which;
                var text = $('#rollMsg').val();
                if ((_key == 13)) {
                    if (keyTag) {
                        keyTag = false;
                        eveSetPop();
                    }
                };
            });
            //按钮或键盘触发发布弹幕
            function eveSetPop() {
                var text = $('#rollMsg').val();
                if (!!text) {
                    $('.setMsg').fadeOut();
                } else {
                    keyTag = true;
                    alert('请输入内容！');
                    return false;
                };
                self.userSetPop(text);
                keyCur = true;
            };
        },
        //手动发送弹幕
        userSetPop: function (text) {
            var self = this;
            var iconType = Math.floor(Math.random() * 3 + 1);
            //console.log(text);
            var div = '<div class="cmt">' + '<span class="jt jt_icon' + iconType + ' pa"></span><span class="jj jj_icon' + iconType + ' pa"></span><span class="b bg' + iconType + '"></span>' + text + '</div>';
            $("#commentCanvas").append(div);
            //调用初始化弹幕
            self.initPopDom(div);
        },
        //随机发送弹幕事件
        ranPopEven: function () {
            var self = this;
            //初始调用一次
            self.initRanPop();
            clearInterval(self._timer);
            self._timer = setInterval(function () {
                //if($('#commentCanvas').children().length<=10){
                self.initRanPop();
                //}     
            }, self.ranSpeed);

        },
        //清空随机发送
        clearFlipPop: function (cl) {
            var self = this;
            clearInterval(self._timer);
            if (!!cl) {
                self.flipId.empty();
            }
        },
        //随机发送弹幕
        initRanPop: function () {
            var self = this;
            //console.log(index);
            var text = self.popTxtArr[self._index];
            var iconType = Math.floor(Math.random() * 3 + 1);

            //console.log(text);
            var div = '<div class="cmt">' + '<span class="jt jt_icon' + iconType + ' pa"></span><span class="jj jj_icon' + iconType + ' pa"></span><span class="b bg' + iconType + '"></span>' + text + '</div>';
            $("#commentCanvas").append(div);
            self.initPopDom(div);

            self.emNum++;
            //轮寻整个数组
            if (self._index >= self.popTxtArr.length - 1) {
                self._index = 0;
            } else {
                self._index++;
            };
            //开始清除元素
            /*if(emNum>xx.length/2){
                $("#commentCanvas").find('.cmt').first().remove();    
            }*/
        },
        //初始化当前弹幕元素(接收当前dom元素)
        initPopDom: function (dom) {
            var self = this;
            var jq_dom = $(dom);

            var rr1 = parseInt(Math.random() * self.orbit + 0);
            //防止重复位置
            if (rr1 == self.oldy) {
                rr1 = parseInt(Math.random() * self.orbit + 0);
            };
            self.oldy = rr1;
            //随机的速度
            var ran_speed = parseInt(Math.random() * self.liveTime.max + self.liveTime.min);
            //当前y轴间距位置
            var space_y = rr1 * self.domSpace;
            //屏幕缩放误差比例
            var sc = self.winWid * (1 - (self.winWid / 2560)).toFixed(2);
            if (self._self.bw.isIE8 || self._self.bw.isIE7 || self._self.bw.isIE6) {
                sc = 0;
            };
            $("#commentCanvas").find(".cmt").show(function () {

                $(this).css({
                    left: self.winWid + sc / 2,
                    bottom: space_y,
                    color: self.getRanColor()
                });

                var thisWid = parseInt($(this).width());
                $(this).animate({
                    left: "-" + (thisWid + sc) + "px"
                }, ran_speed, function () {
                    $(this).remove();
                });
            });
        },
        //随机获取颜色
        getRanColor: function () {
            //var colorArr = ['#9dcd99','#64c481','#cc88cb','#88b5cc','#888acc','#ccc388','#b89188'];
            var colorArr = ['#000', '#f7f2e3'];
            var cNum = parseInt(Math.random() * (colorArr.length - 1));
            return colorArr[cNum];
        }
    },
    //slogan帧动画
    animSlogan: function () {
        var i = 1;
        var maxv = 49;
        var timer = setInterval(function () {
            i++;
            if (i > 49) {
                $('.slogan .zz').fadeIn();
                clearInterval(timer);
                return false;
            }
            cgfn();
        }, 60);

        function cgfn() {
            /*var y = parseInt(i/5) + (i%5 != 0?1:0);
            var x = parseInt(i%5) + (i%5 == 0?5:0);
            var px = (x-1)/(5-1)*100;
            var py = (y-1)/(10-1)*100;
            var imgPos = px.toFixed(2)+'%'+' '+py.toFixed(2)+'%';
            $('.slogan .img').css('backgroundPosition',imgPos);*/

            //使用图片替换
            $('.slogan .img>img').attr('src', 'images/v6/slogan/' + (32 + i) + '.png');
        }
    },
    //插入第三屏视频
    videoInsert: function () {
        var url = 'http://videogame.ztgame.com.cn/xx2/20161110/fly_20161110-147875980611.mp4&amp;videoEnd=videoEnd';
        var videoDom = '<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="100%" height="100%" id=fl_obj name=fl_obj><param name=movie value="swf/v6/noTools2.swf?videoUrl=' + url + '" ref=""><param name=quality value=High><param name=Src ref="" value="swf/v6/noTools2.swf?videoUrl=' + url + '"><param name=WMode value=transparent><param name=AllowScriptAccess value=always><param name=Scale value=ShowAll><embed src="swf/v6/noTools2.swf?videoUrl=' + url + '" quality=high pluginspage=http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash type=application/x-shockwave-flash width="100%" height="100%" wmode=transparent id=fl_embed name=fl_embed></object>';

        $('#flashBox').append(videoDom);
    }
};


//doFn.init();
var state = true;

function videoOk() {
    if (!state) {
        return false
    };
    state = false;
    //alert('加载完成');
    setTimeout(function () {
        $('#commentCanvas').fadeIn();
        //调用弹幕
        doFn.flipPop.init();
        //插入第三屏视频
        doFn.videoInsert();
    }, 2000);
};
//定时10s，
setTimeout(function () {
    if (state) {
        state = false;
        //$('#commentCanvas').fadeIn();
        //调用弹幕
        //doFn.flipPop.init();
        //插入第三屏视频
        doFn.videoInsert();
    }
}, 10000);


var tag1 = true;

function setPop() {
    if (tag1) {
        $('.setMsg').fadeIn();
    } else {
        $('.setMsg').fadeOut();
    };
    tag1 = !tag1;
};
//调用弹幕
doFn.flipPop.init();

function tagPop(type) {
    /*0隐藏，1显示*/
    if (type == 1) {
        //清空随机，参数true清空dom
        doFn.flipPop.clearFlipPop(false);
        $('#commentCanvas').fadeOut();
        $('.setMsg').fadeOut();
    } else {
        $('#commentCanvas').fadeIn();
        doFn.flipPop.clearFlipPop(false);
        doFn.flipPop.ranPopEven();
    }
};
$(function () {
    //设置每一块的高度
    doFn.setHeight(['wrap', 'column']);
    //ie兼容处理
    doFn.ieSet();
    //翻页
    doFn.changePage('content', 'navRight ul');
    //切换图片
    doFn.leftRightTab('tabbtn .btn.l', 'tabbtn .btn.r', 'bnImgList .list');
    //图片预览效果
    doFn.imgView('bnImgList area', 'lightboxImg', 'imgViewPop .btn');
    //space后播放图片
    doFn.spacePlay('images/v6/flight/Comp 1_1_000');
    //隐藏
    doFn.hidePop();
    //显示右新闻
    doFn.showNews('rightNews .btn_box', 'rightNews');
    doFn.showNewsOnly('navRight .item.i6', 'rightNews');
    //花瓣跟随鼠标
    doFn.moves('petals');

});

var _is = true;

function videoEnd() {
    setTimeout(function () {
        $('.row3 .zz').fadeIn();
        $('.row3 .box').fadeIn();
        $('.row3 .bgimg').fadeIn();
        //让页面获得焦点
        $('.row3 .box').focus();
        _is = true;
    }, 3000);
};