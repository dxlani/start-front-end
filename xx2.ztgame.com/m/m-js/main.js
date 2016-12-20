// zepto.fullpage插件滚屏效果
$('.wp-inner').fullpage();

// 点击图片展现图片预览层
$('.f2').on({
    'touchstart': function () {
        $('.popup-bg').show();
        $('.f2-images').on({
            'touchmove': function () {

            }
        })
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
    var dX = 0;
    var dY = 0;
    var abs = 0;
    var oIndex = 0;
    var tX = 0;
    var liW = parseInt($('.f2-images').css('width'));
    var $self = $(jqClass);
    $self.on('touchstart', function () {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    });

    $self.on('touchend', function () {
        endX = event.changedTouches[0].clientX;
        endY = event.changedTouches[0].clientY;
        dX = endX - startX;
        dY = endY - startY;
        abs = Math.abs(dX) - Math.abs(dY);
        switch (slideDirect()) {
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
        tX = -oIndex * liW;
        // 没有引入zepto.animate模块 动画是与css里的transition结合完成的 
        $('.over').find('ul').css({
            'transform': 'translateX(' + tX + 'px)'
        })
    });

    // 判断滑动方向  注意移动是与滑动相反的方向　左滑应该右移 
    function slideDirect() {
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