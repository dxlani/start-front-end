var doFn = {
    //鼠标滚动 上下箭头键 鼠标点击导航按钮页面切换
    scrollFn: function () {
        // 当前所在屏幕 从0开始
        var onIndex = 0;
        // container的margin-top
        var mt = 0;
        // 是否正在滚动
        var onScroll = false;
        // info弹出层状态
        var infoOut = false;
        // clearTimer
        var infoTimer = null;
        var p4Timer = null;

        function preventCombo() {
            // 如果没有在滚动 开始滚动 并将onScroll设置为true 
            // 设置一个倒计时 防止频繁出发滚动事件 滚动完成后将onScroll设置为false
            if (!onScroll) {
                onScroll = true;
                setTimeout(function () {
                    onScroll = false;
                }, 500);
                return false;
            } else {
                return true;
            }

        }

        (function pageScroll() {
            // 给document绑定鼠标滚轮事件、键盘事件、鼠标移动事件
            $(document).on('mousewheel keydown', function () {
                if (preventCombo()) {
                    return;
                };

                e = event || window.event;
                // 滚轮向下滚动event.wheelDelta为负 onIndex++
                if (e.wheelDelta < 0 || e.keyCode == 40) {
                    if (onIndex <= 3) {
                        onIndex++;
                    }
                }
                // 滚轮向上滚动event.wheelDelta为正 onIndex--
                else if (e.wheelDelta > 0 || e.keyCode == 38) {
                    if (onIndex >= 1) {
                        onIndex--;
                    }
                }

                whenIndexChange();
            });
        })();

        (function swipe() {
            // 移动端滑动事件
            var startX = 0;
            var startY = 0;
            var endX = 0;
            var endY = 0;
            $(document).on({
                'touchstart': function (event) {
                    startX = event.touches[0].clientX;
                    startY = event.touches[0].clientY;
                },
                'touchend': function (event) {
                    if (preventCombo()) {
                        return;
                    };

                    endX = event.changedTouches[0].clientX;
                    endY = event.changedTouches[0].clientY;
                    var dX = endX - startX;
                    var dY = endY - startY;
                    switch (slideDirect(dX, dY)) {
                        case -2:
                            if (onIndex < 4) {
                                onIndex++;
                            }
                            break;
                        case 2:
                            if (onIndex > 0) {
                                onIndex--;
                            }
                            break;
                    }
                    whenIndexChange();
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
        })();

        function whenIndexChange() {
            // onIndex改变时的一些逻辑

            setMtAndOn();
            // info控制 在第五屏定时弹出 不在隐藏 在第一屏漏个按钮
            clearTimeout(infoTimer);
            if (onIndex === 4) {
                    infoTimer = setTimeout(function () {
                    $('.info').fadeIn(300);
                    infoOut = true;
                    infoToggle();
                }, 4000);
            } else {
                if (onIndex === 0) {
                    $('.info').fadeIn(300);
                } else {
                    $('.info').fadeOut(300);
                }
                infoOut = false;
                infoToggle();
            }


            // 第四屏看完动画再绑定事件
            if (onIndex === 3) {
                clearTimeout(p4Timer);
                    p4Timer = setTimeout(function () {
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

            var clientH = $(window).height();
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
                $('.info').stop(false, true).animate({
                    'left': 0
                }, 300, function () {
                    $('.info-arrow').addClass('inverse');
                });
            } else {
                $('.info').stop(false, true).animate({
                    'left': '-350px'
                }, 300, function () {
                    $('.info-arrow').removeClass('inverse');
                });
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
                    $('.info').fadeIn(300);
                    infoOut = !infoOut;
                    infoToggle();
                })
            } else {
                $(this).click(function () {
                    onIndex = index;
                    whenIndexChange();
                })
            }
        });
    },

    touchEvent: function () {

        // skill模拟hover
        $('.skill').on({
            'touchstart': function (event) {
                $(this).addClass('inverse');
            },
            'touchend': function (event) {
                setTimeout(function () {
                    $(event.delegateTarget).removeClass('inverse');
                }, 800);
            }
        });
    },

}

doFn.scrollFn();
doFn.touchEvent();