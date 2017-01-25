$(function(){
	// 图片放大缩小
	$(".goods .content-l").each(function(){
		$(this).find("a").hover(
			function(){
			$(this).find("img").stop(false,true).animate({width:"120%",height:"120%",marginLeft:"-10%",marginTop:"-10%"},300)
			},
			function(){
			$(this).find("img").stop(false,true).animate({width:"100%",height:"100%",marginLeft:"0%",marginTop:"0%"},300)	
			}	
		);
	});
	//二级菜单弹出隐藏
	// $('.shopItem').each(function(){
	// 	$(this).mouseover(function(){
	// 		$(this).addClass('cur');
	// 		$(this).find('.shopList').css({'display': 'block'});
	// 	});
	// 	$(this).mouseout(function(){
	// 		$(this).removeClass('cur');
	// 		$(this).find('.shopList').css({'display': 'none'});
	// 	});
	// });
	$('.shopItem').each(function() {
		$(this).hover(
			function() {
			$(this).addClass('cur');
			$(this).find('.shopList').css({'display': 'block'});
			},
			function() {
				$(this).removeClass('cur');
				$(this).find('.shopList').css({'display': 'none'});
			}
		);
	});
});