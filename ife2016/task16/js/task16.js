// 定义二维数组 判断输入的内容并加入aqiData
var aqiData = [];
var judge =function () {
	var city = document.getElementById('aqi-city-input');
	var socre = document.getElementById('aqi-value-input');
	var cityValue = city.value.trim();
	var socreValue = socre.value.trim();
	// var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
	if (!isNaN(cityValue)) {
		alert('城市名必须为中英文');
		city.value = '';
	}	
	else if (!socreValue || isNaN(socreValue)) {
		alert('aqi值必须为数字');
		socre.value = '';
	}
	else {
		var aqiCity = new Array(2);
		aqiCity[0] = cityValue;
		aqiCity[1] = socreValue;
		aqiData.push(aqiCity);
		if (aqiData.length >1 && String(aqiData[aqiData.length-1]) == String(aqiData[aqiData.length-2])) {
			alert("请勿添加重复数据");
			aqiData.pop();
		}
	}

};

// 添加和删除tr
var AddandDel = function () {
	var table = document.getElementById('aqi-table');
	var addData = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
	for (var i = 0;i < aqiData.length;i++) {
		addData += ('<tr><td>' + aqiData[i][0] + '</td><td>' + aqiData[i][1] + '</td><td><button>删除</button></td></tr>');
	}
	table.innerHTML = addData;
	if (aqiData.length == 0) {
		table.innerHTML = '';
	}

	// 点击对应的button删除对应的数据
	var delButton = document.getElementById('aqi-table').getElementsByTagName('button');
	for (var i = 0; i < delButton.length; i++) {
		(function (i) {	
			delButton[i].onclick = function () {
				aqiData.splice(i,1);
				AddandDel();
			}
		})(i);
	}
};

// 点击执行
(function clickBtn() {
	var addBtn = document.getElementById('add-btn');
	addBtn.onclick = function () {
		judge();
		AddandDel();
	}
})();