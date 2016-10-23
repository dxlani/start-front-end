function startMove(obj,json,fn){		
					clearInterval(obj.timer);
					obj.timer= setInterval(function(){						
						var flag=true;
						for(var attr in json){
							//取当前属性的值
							var cur= 0;
							if(attr=='opacity'){
							cur= Math.round(parseFloat(getStyle(obj,attr)*100)); //能让范围回到0~100
							}
							else{
							cur = parseInt(getStyle(obj,attr));
							}
							//定义速度
							var speed = (json[attr] - cur)/ 8 ;
							// 取整速度
							speed= speed >0?Math.ceil(speed):Math.floor(speed);
							//立flag
								if(cur!=json[attr]){
									flag=false;
									if(attr== 'opacity'){
										//firefox浏览器
										obj.style.opacity = (cur + speed)/100;
										//IE浏览器 
										obj.style.filter  = 'alpha:(opacity:'+(cur+speed)+')';
									}
									else{
									obj.style[attr]   = cur + speed +'px';
									}
								}
								if(flag){
									clearInterval(obj.timer);
									if(fn){
										fn();
									}
								}
						}	
					},30)

				}
function getStyle(obj,attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}
	else{
		return getComputedStyle(obj,false)[attr];
	}
}