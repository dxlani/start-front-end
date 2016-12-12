// container的margin-top
var mt = 0;
// 是否正在滚动
var onScroll = false;
// 计数器
var timer = null;
// 下标
var onIndex = 0;
// 默认屏幕高度
var screenHeight = 734;
// 新闻弹出层状态
var newsOut = true;

function MouseWheelHandler(e) {
    e = event || window.event;
    // 如果没有在滚动 开始滚动 将onScroll设置为true 设置一个1s的倒计时 与css3动画时间一致 滚动完成后将onScroll设置为false
    if (!onScroll) {
        onScroll = true;
        timer = setTimeout(function () {
            onScroll = false;
            timer = null;
        }, 1000);
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
        newsControl()
        setMtAndOn();
    }
}

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

// 新闻弹出层缩进和弹出
function newsToggle() {
    if (newsOut) {
        $('.news-right').animate({
            marginLeft: 0
        }, 300);
    } else {
        $('.news-right').animate({
            marginLeft: '-269px'
        }, 300);
    }
}

// 新闻弹出层渐隐和展现动画
function newsHide() {
    $('.news-right').fadeOut(300);
}

function newsShow() {
    $('.news-right').fadeIn(300);
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
    screenHeight = $(document).height();
    mt = -screenHeight * onIndex;
    $('.container').css('margin-top', mt);
    currentOn('.column');
    currentOn('.item');
}


// 点击切换
$('.news-btn').click(function () {
    newsOut = !newsOut;
    newsToggle();
})

// 点击nav-right切换至对应屏
$('.nav-right > a').each(function (index) {
    if (index == 5) {
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
})

// 给document绑定鼠标滚轮事件、键盘事件、鼠标移动事件
$(document).on({
    'mousewheel keydown': function (e) {
        MouseWheelHandler(e);
    },
    'mousemove': function (e) {
        petalsMove(e);
    }
})

var _l = [];
var _t = [];
var _x = 0;
var _y = 0;
$('.petals>div').each(function (index) {
    var $self = $(this);
    _l[index] = parseInt($self.css('left'));
    _t[index] = parseInt($self.css('top'));
});

function petalsMove(e) {
    _x = e.pageX;
    _y = e.pageY;
    $('.petals>div').each(function (index) {
        var $self = $(this);
        if (index % 2 == 0) {
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