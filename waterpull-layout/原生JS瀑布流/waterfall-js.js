window.onload=function(){
	waterFall('main','pin');
	var dateInt={'date':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'},{'src':'5.jpg'}]};
	window.onscroll=function(){
		if(checkScroll()){
			var main=document.getElementById('main');
			for (var i = 0;i<dateInt.date.length;i++){
				var oPin=document.createElement('div');
				oPin.className='pin';
				main.appendChild(oPin);
				var oBox=document.createElement('div');
				oBox.className='box';
				oPin.appendChild(oBox);
				var oImg=document.createElement('img');
				oImg.src='images/'+dateInt.date[i].src;
				oBox.appendChild(oImg);
			}
			waterFall('main','pin');
		}
	};
};
function getClass(parent,cls){
	var result=[];
	var all=parent.getElementsByTagName('*');
	for (var i = 0; i < all.length; i++) {
		if(all[i].className.indexOf(cls)!=-1){
			result.push(all[i]);
		}
	}
	return result;		
};
function waterFall(parent,child){
		var main=document.getElementById(parent);
		var pinS=getClass(main,child);
		var pinW=pinS[0].offsetWidth;
		var cols=Math.floor(document.documentElement.clientWidth/pinW);
		main.style.cssText='width:'+cols*pinW+'px;margin:0 auto';
		var hArr=[];
		for(var i=0;i<pinS.length;i++){
			var pinH=pinS[i].offsetHeight;
				if(i<cols){
					hArr[i]=pinH;
				}
				else{
					var minH=Math.min.apply(null,hArr);
					var minHIndex=hArr.indexOf(minH);
					pinS[i].style.position='absolute';
					pinS[i].style.top=minH+'px';
					pinS[i].style.left=pinS[minHIndex].offsetLeft+'px';
					hArr[minHIndex]+=pinS[i].offsetHeight;
				};
		};
};
function checkScroll(){
		var main=document.getElementById('main');
		var pinS=getClass(main,'pin');
		var lastpinH=pinS[pinS.length-1].offsetTop+Math.floor(pinS[pinS.length-1].offsetHeight/2);
		var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
		var documentH=document.documentElement.clientHeight;
		return (lastpinH<scrollTop+documentH)?true:false;
}