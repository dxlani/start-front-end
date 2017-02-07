var doFn = {
    f2PictureFn: function () {
        // 点击图片展现图片预览层
        $('.f2').on({
            'touchstart': function () {
                $('.popup-bg').show()
            }
        });

        // 点击关闭按钮隐藏图片预览层
        $('.close-btn').on({
            'touchstart': function () {
                $('.popup-bg').hide();
            }
        });

        slide('.f2-images');

        //二屏预览图片滑动 参数以jq形式传入 eg: '.Class'
        function slide(jqClass) {
            var startX = 0;
            var startY = 0;
            var endX = 0;
            var endY = 0;
            var oIndex = 0;
            var $self = $(jqClass);
            $self.on({
                'touchstart': function () {
                    startX = event.touches[0].clientX;
                    startY = event.touches[0].clientY;
                },
                'touchend': function () {
                    event.stopPropagation();
                    endX = event.changedTouches[0].clientX;
                    endY = event.changedTouches[0].clientY;
                    var dX = endX - startX;
                    var dY = endY - startY;
                    switch (slideDirect(dX, dY)) {
                        case -1:
                            if (oIndex < $self.length - 1) {
                                oIndex++;
                            } else {
                                oIndex = 0;
                            }
                            break;
                        case 1:
                            if (oIndex > 0) {
                                oIndex--;
                            } else {
                                oIndex = 0;
                            }
                            break;
                    }
                    var itemW = parseInt($(jqClass).css('width'));
                    var tX = -oIndex * itemW;
                    // 没有引入zepto.animate模块 动画是与css里的transition结合完成的 
                    $('.over').find('ul').css({
                        'transform': 'translateX(' + tX + 'px)'
                    })
                }
            });

            // 判断滑动方向  注意移动是与滑动相反的方向　左滑应该右移 
            function slideDirect(dX, dY) {
                var abs = Math.abs(dX) - Math.abs(dY);
                if (dX === 0 && dY === 0) {
                    // 没有滑动
                    return 0;
                } else if (abs > 0) {
                    if (dX > 0) {
                        // 右滑
                        return 1;
                    } else {
                        // 左滑
                        return -1;
                    }
                } else {
                    if (dY > 0) {
                        // 下滑
                        return 2;
                    } else {
                        // 上滑
                        return -2;
                    }
                }
            }
        }
    },

    newsControlFn: function () {
        // 点击右上角按钮弹出新闻层
        $('.news-btn').on('touchstart', function () {
            $('.news-box').css({
                'left': 0,
                'opacity': 1
            });
        });

        // 点击返回按钮关闭新闻层
        $('.news-back').on('touchstart', function () {
            $('.news-box').css({
                'left': '-100%',
                'opacity': 0
            });
        });

        // 新闻切换
        $('.news-tab').on('touchstart', function () {
            var $self = $(this);
            if ($self.attr('class').indexOf('on') === -1) {
                $('.news-tab').removeClass('on');
                $self.addClass('on');
                // 两个news-list 其data-tab属性与所点击的按钮相同就切换至此列表
                $('.news-list').each(function () {
                    if ($(this).attr('data-tab') === $self.attr('data-tab')) {
                        $('.news-list').hide();
                        $(this).show();
                    }
                })
            }
        });

    },

    // 检测横屏
    judgeScreen: function () {
        $(window).on('onorientationchange' in window ? 'onorientationchange' : 'resize', function () {
            var deg = window.orientation;
            // 竖屏
            // if (deg === 0 || deg === 180) {
            //     alert('竖屏');
            // }
            
            // 横屏
            if (deg === 90 || deg === -90) {
                alert('竖屏浏览获得更佳体验！');
            }
        });
    },

    //请求新闻内容
    getNews: function () {
        var doms = $('.newsli>a');
        doms.unbind('click');
        var newstitledom = $('.newsDetails .tit');
        var newsdatedom = $('.newsDetails .time');
        var newstxtdom = $('.newsDetails .box');

        doms.bind('click', function (e) {
            var newsid = $(this).attr('newsid');
            var newstitle = $(this).attr('newstitle');
            var newsdate = $(this).attr('newsdate');
            var _url = 'news/newsinfo_' + newsid + '.html'
            $.ajax({
                url: _url,
                type: 'GET',
                dataType: 'html',
                error: function (msg) {
                    console.log(msg);
                },
                success: function (result) {
                    $('.newsList').removeClass('on');
                    $('.newsDetails').addClass('on');
                    newstitledom.html(newstitle);
                    newsdatedom.html(newsdate);
                    newstxtdom.empty();
                    newstxtdom.append(result);
                }
            });
        });
    }

}

// zepto.fullpage插件滚屏效果
$('.wp-inner').fullpage();

doFn.f2PictureFn();
doFn.newsControlFn();
doFn.judgeScreen();