$(document).ready(function(){
	var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'},{'src':'5.jpg'}]};
	waterFall();
	$(window).scroll(function(){
		if(checkScroll()){
			$.each(dataInt.data,function(){
			var oPin=$('<div>').addClass('pin').appendTo($('#main'));
			var oBox=$('<div>').addClass('box').appendTo(oPin);
			$('<img>').attr('src','../images/' + $(this).attr('src') ).appendTo(oBox);
			});
		}
		waterFall();
		console.log($(window).scrollTop());
	});		
});
function waterFall(){
		var aPin=$('.pin');
		var main=$('#main');
		var oPinW=aPin.eq( 0 ).outerWidth();
		num=Math.floor($(window).width() / oPinW);
		main.css({'width':oPinW*num,
				'margin':'0 auto'})
		var pinHArr=[];
		aPin.each(function(index,value){
			var pinH=aPin.eq(index).outerHeight();
			if(index<num){
				pinHArr[index]=pinH;
			}
			else{
				var minH=Math.min.apply(null,pinHArr);
				var minIndex=pinHArr.indexOf(minH);
				aPin.eq(index).css({
					'position':'absolute',
					'top':minH,
					'left':aPin.eq(minIndex).position().left
				});
				pinHArr[minIndex]+=$(value).outerHeight();
			}
		})
};
function checkScroll(){
	var aPin=$('.pin');
	var lastPin=aPin.last();
	var lastH=lastPin.offset().top+Math.floor(lastPin.height()/2);
	var scrollH=$(window).height()+$(window).scrollTop();
	return scrollH>lastH?true:false;
}