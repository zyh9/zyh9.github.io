(function(){
	setLoding();
	//anmt5();
	setPerc();
})();

/* 
	根据当前屏幕的大小，来计算景深 \
	1.固定视野的角度大小，根据这个角度的大小，计算出景深
	2. 保持我和景物之间的距离不变
*/
function setPerc(){
	resetview();
	window.onresize = resetview;
	function resetview(){
		var view = document.querySelector('#view');
		var mian = document.querySelector('#mian');
		var deg = 52.5;//是参照原网站
		var height = document.documentElement.clientHeight;
		var R = Math.round(Math.tan(deg/180*Math.PI)*height*.5);
		view.style.WebkitPerspective = view.style.perspective = R + "px";
		css(mian,"translateZ",R);

	}
}

/* 做图片预加载 */
document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});
function setLoding(){
	var logoText = document.querySelector('.logoText');
	var data = [];
	var nub = 0;
	for(var s in imgData) {
		//console.log(imgData[s]);
		data = data.concat(imgData[s]);
	}
	for(var i = 0; i < data.length; i++){
		var img = new Image();
		img.src = data[i];
		img.onload = function(){
			nub++;
			//console.log(Math.floor(nub/data.length*100));
			logoText.innerHTML = "已加载 "+(Math.floor(nub/data.length*100))+"%";
			if(nub == data.length){
				//图片加载完成之后，要做的事情
				anmt();
			}
		};
	}
}
/* 隐藏loding动画，开始让logo2显示出来 */
function anmt(){
	var view = document.querySelector('#view');
	var logo1 = document.querySelector('#logo1');
	var logo2 = document.createElement("div");
	var logo3 = document.createElement("div");
	var img = new Image();
	var img2 = new Image();
	img.src = imgData.logo[0];
	img2.src = imgData.logo[1];
	logo2.id = "logo2";
	logo3.id = "logo3";
	logo3.className = logo2.className = "logoImg";
	logo2.appendChild(img);
	logo3.appendChild(img2);
	css(logo2,"opacity",0);
	css(logo3,"opacity",0);
	css(logo2,"translateZ",-1000);
	css(logo3,"translateZ",-1000);	
	view.appendChild(logo2);
	view.appendChild(logo3);	
	MTween({
		el: logo1,
		target: {opacity:0},
		time: 1000,
		type: "easeOut",
		callBack: function(){
			view.removeChild(logo1);
			css(logo2,"opacity",100);
			MTween({
				el: logo2,
				target: {translateZ:0},
				time: 300,
				type: "easeBoth",
				callBack:anmt2
			});
		}
	});
}
/* 隐藏logo2，开始让logo3显示出来 */
function anmt2(){
	var view = document.querySelector('#view');
	var logo2 = document.querySelector('#logo2');
	var logo3 = document.querySelector('#logo3');
	setTimeout(function(){
		MTween({
			el: logo2,
			target: {translateZ:-1000},
			time: 800,
			type: "linear",
			callBack: function(){
				view.removeChild(logo2);
				css(logo3,"opacity",100);
				setTimeout(function(){
					MTween({
						el: logo3,
						target: {translateZ:0},
						time: 300,
						type: "easeBoth",
						callBack: anmt3
					});
				},300);
			}
		});
	},2000);
}
/* 隐藏logo3，显示小的爆炸效果 */
function anmt3(){
	var view = document.querySelector('#view');
	var logo3 = document.querySelector('#logo3');
	setTimeout(function(){
		MTween({
			el: logo3,
			target: {translateZ:-2000},
			time: 2000,
			type: "easeIn",
			callBack: function(){
				view.removeChild(logo3);
				//开始添加爆照效果
				anmt4();
			}
		});
	},1000);
}
/* logo4的生成*/
function anmt4(){
	var view = document.querySelector('#view');
	var logo4 = document.createElement("div");
	var logoIcos = document.createElement("div");
	var logo4Img = new Image();
	var iconsLength = 27;
	logo4.id = "logo4";
	logo4Img.id = "logo4Img";
	logoIcos.id = "logoIcos";
	logo4Img.src = imgData.logo[2];
	css(logo4,"translateZ",-2000);
	for(var i = 0; i < iconsLength; i++){
		var span = document.createElement("span");
		var xR = 20+Math.round(Math.random()*240);
		var xDeg = Math.round(Math.random()*360)//(360/9)*(i%9);
		var yR = 10+Math.round(Math.random()*240);
		var yDeg = Math.round(Math.random()*360)//(360/9)*(i%9);
		css(span,"rotateY",xDeg);
		css(span,"translateZ",xR);
		css(span,"rotateX",yDeg);
		css(span,"translateY",yR);
		span.style.backgroundImage = "url("+imgData.logoIco[i%imgData.logoIco.length]+")";
		logoIcos.appendChild(span);
	}
	logo4.appendChild(logoIcos);
	logo4.appendChild(logo4Img);
	view.appendChild(logo4);
	MTween({
		el: logo4,
		target: {translateZ: 0},
		time: 500,
		type: "easeOutStrong",
		callBack:function(){
			setTimeout(function(){
				MTween({
					el: logo4,
					target: {translateZ: -1000,scale:20},
					time: 3000,
					type: "linear",
					callBack: function(){
						view.removeChild(logo4);
						anmt5();
					}
				});
			},100);
		}
	});
}
/* 主体开始入场 */
function anmt5(){
	var tZ = document.querySelector('#tZ');
	css(tZ,"translateZ",-2000);
	anmt7();
	anmt6();
	createPano();
	MTween({
		el:tZ,
		target: {translateZ:-160},
		time: 3600,
		type: "easeBoth"
	});
}
/* 生成主体的背景圆柱,圆柱入场 */
function anmt6(){
	var panoBg = document.querySelector('#panoBg');
	var width = 129;
	var deg = 360/imgData.bg.length;
	var R = parseInt(Math.tan((180-deg)/2*Math.PI/180)*(width/2)) - 1;
	var startDeg = 180;
	css(panoBg,"rotateX",0);
	css(panoBg,"rotateY",-695);
	for(var i = 0; i < imgData.bg.length; i++){
		var span = document.createElement("span");
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		span.style.backgroundImage = "url("+imgData.bg[i]+")";
		span.style.display = "none";
		panoBg.appendChild(span);
		startDeg -= deg;
	}
	var nub = 0;
	var timer = setInterval(function(){
		panoBg.children[nub].style.display = "block";
		nub++;
		if(nub >= panoBg.children.length){
			clearInterval(timer);
		}
	},3600/2/20);
	MTween({
		el: panoBg,
		target: {rotateY:25},
		time: 3600,
		type: "linear",
		callBack:function(){
			setDarg();
			setTimeout(function(){
				setSensors();
			},1000);
				
		}
	});
}
/*添加云朵及云朵入场*/
function anmt7(){
	var cloud = document.querySelector('#cloud');
	css(cloud,"translateZ",-400);
	for(var i = 0; i < 9; i++){
		var span = document.createElement("span");
		span.style.backgroundImage = "url("+imgData.cloud[i%3]+")";
		var R = 200+(Math.random()*150);
		var deg = (360/9)*i;
		var x = Math.sin(deg*Math.PI/180)*R;
		var z = Math.cos(deg*Math.PI/180)*R;
		var y = (Math.random()-.5)*200
		css(span,"translateX",x);
		css(span,"translateZ",z);
		css(span,"translateY",y);
		span.style.display = "none";
		cloud.appendChild(span);
	}
	var nub = 0;
	var timer = setInterval(function(){
		cloud.children[nub].style.display = "block";
		nub++;
		if(nub >= cloud.children.length){
			clearInterval(timer);
		}
	},50);
	MTween({
		el:cloud,
		target: {rotateY:540},
		time: 3500,
		type: "easeIn",
		callIn:function(){
			var deg = -css(cloud,"rotateY");
			for(var i = 0; i < cloud.children.length; i++){
				css(cloud.children[i],"rotateY",deg);
			}
		},
		callBack:function(){
			cloud.parentNode.removeChild(cloud);
			bgShow();
		}
	});
}
function setDarg(){
	var pano = document.querySelector('#pano');
	var panoBg = document.querySelector('#panoBg');
	var tZ = document.querySelector('#tZ');
	var startPoint = {x:0,y:0};
	var panoBgDeg = {x:0,y:0};
	var scale ={x:129/18,y:1170/80} 
	var startZ = css(tZ,"translateZ");
	var lastDeg = {x:0,y:0};
	var lastDis = {x:0,y:0};
	document.addEventListener('touchstart', function(e) {
		window.isTouch = true;
		clearInterval(pano.timer);
		clearInterval(panoBg.timer);
		clearInterval(tZ.timer);
		startPoint.x = e.changedTouches[0].pageX;
		startPoint.y = e.changedTouches[0].pageY;
		panoBgDeg.x = css(panoBg,"rotateY");
		panoBgDeg.y = css(panoBg,"rotateX");
	});
	document.addEventListener('touchmove', function(e) {
		var nowPoint = {};
		var nowDeg = {};
		var nowDeg2 = {};
		nowPoint.x = e.changedTouches[0].pageX;
		nowPoint.y = e.changedTouches[0].pageY;
		var dis = {}
		dis.x = nowPoint.x - startPoint.x;
		dis.y = nowPoint.y - startPoint.y;
		var disDeg = {};
		disDeg.x = -(dis.x/scale.x);
		disDeg.y = dis.y/scale.y;
		nowDeg.y = panoBgDeg.y + disDeg.y;
		nowDeg.x = panoBgDeg.x + disDeg.x;
		nowDeg2.x = panoBgDeg.x + (disDeg.x)*.95;
		nowDeg2.y = panoBgDeg.y + (disDeg.y)*.95;
		if(nowDeg.y > 45){
			nowDeg.y = 45;
		} else if(nowDeg.y < -45) {
			nowDeg.y = -45;
		}
		if(nowDeg2.y > 45){
			nowDeg2.y = 45;
		} else if(nowDeg2.y < -45) {
			nowDeg2.y = -45;
		}
		lastDis.x =  nowDeg.x - lastDeg.x;
		lastDeg.x = nowDeg.x;
		lastDis.y =  nowDeg.y - lastDeg.y;
		lastDeg.y = nowDeg.y;
		css(panoBg,"rotateX",nowDeg.y);
		css(panoBg,"rotateY",nowDeg.x);
		css(pano,"rotateX",nowDeg2.y);
		css(pano,"rotateY",nowDeg2.x);
		var disZ = Math.max(Math.abs(dis.x),Math.abs(dis.y));
		if(disZ > 300){
			disZ = 300;
		}
		css(tZ,"translateZ",startZ -disZ);
	}); 
	document.addEventListener('touchend', function(e) {
		var nowDeg = {x:css(panoBg,"rotateY"),y:css(panoBg,"rotateX")};
		console.log(lastDis.x);
		var disDeg = {x:lastDis.x*10,y:lastDis.y*10};
		MTween({
			el:tZ,
			target:{translateZ:startZ},
			time: 700,
			type: "easeOut"
		});
		MTween({
			el:panoBg,
			target:{rotateY:nowDeg.x + disDeg.x},
			time: 800,
			type: "easeOut"
		});
		MTween({
			el:pano,
			target:{rotateY:nowDeg.x + disDeg.x},
			time: 800,
			type: "easeOut",
			callBack: function(){
				window.isTouch = false;
				window.isStart = false;
			}
		});
	}); 
}
function setSensors(){
	var pano = document.querySelector('#pano');
	var panoBg = document.querySelector('#panoBg');
	var start = {};
	var now = {};
	var startEl = {};
	var lastTime = Date.now();
	var scale = 129/18;
	var startZ = -160;
	var dir = window.orientation; //检测横竖屏
	window.isStart = false;
	window.isTouch = false;
	window.addEventListener('orientationchange', function(e) {
		dir = window.orientation;//用户切换了横竖之后，重置方向
	});
	// deviceorientation执行的间隔 有可能小于
	/*
		注意 用户切换了横屏之后，左右旋转就不再是e.gamma，上下旋转也不再是e.beta，所以陀螺仪记得检测横竖屏
	*/
	window.addEventListener('deviceorientation', function(e)
	{
		if(window.isTouch){
			return;
		}
		switch(dir){
			case 0:
				var x = e.beta;
				var y = e.gamma;
				break;
			case 90:
				var x = e.gamma;
				var y = e.beta;
				break;	
			case -90:
				var x = -e.gamma;
				var y = -e.beta;
				break;	
			case 180:
				var x = -e.beta;
				var y = -e.gamma;
				break;

		}
		var nowTime = Date.now();
		if(nowTime - lastTime < 30){
			return;
		}
		lastTime = nowTime;
		if(!isStart){
			//start
			isStart = true;
			start.x = x;
			start.y = y;
			startEl.x = css(pano,"rotateX");
			startEl.y = css(pano,"rotateY");
		} else {
			//move
			now.x = x;
			now.y = y;
			var dis = {};
			dis.x = now.x - start.x;
			dis.y = now.y - start.y;
			var deg = {};
			deg.x = startEl.x + dis.x;
			deg.y = startEl.y + dis.y;
			//pano.innerHTML = deg.x;
			if(deg.x > 45){
				deg.x = 45;
			} else if(deg.x < -45){
				deg.x = -45;
			}
			var disXZ = Math.abs(Math.round((deg.x  - css(pano,"rotateX"))*scale));
			var disYZ = Math.abs(Math.round((deg.y  - css(pano,"rotateY"))*scale));
			var disZ = Math.max(disXZ,disYZ);
			if(disZ > 300){
				disZ = 300;
			}
			MTween({
				el:tZ,
				target:{
					translateZ: startZ - disZ
				},
				time: 300,
				type: "easeOut",
				callBack: function(){
					MTween({
						el:tZ,
						target:{
							translateZ: startZ
						},
						time: 400,
						type: "easeOut"
					});
				}
			});
			MTween({
				el:pano,
				target:{
					rotateX:deg.x,
					rotateY:deg.y
				},
				time: 800,
				type: "easeOut"
			});
			MTween({
				el:panoBg,
				target:{
					rotateX:deg.x,
					rotateY:deg.y
				},
				time: 800,
				type: "easeOut"
			});
		}
	});
}
function bgShow(){
	var pageBg = document.querySelector('#pageBg');
	MTween({
		el:pageBg,
		target:{opacity:100},
		time: 1000,
		type:"easeBoth"
	});
}
/* 生成 漂浮层 */
function createPano(){
	var pano = document.querySelector('#pano');
	var deg = 18;
	var R = 406;
	var nub = 0;
	var startDeg = 180;
	css(pano,"rotateX",0);
	css(pano,"rotateY",-180);
	css(pano,"scale",0);
	var pano1 = document.createElement("div");
	pano1.className = "pano";
	css(pano1,"translateX",1.564);
	css(pano1,"translateZ",-9.877);
	for(var i = 0; i < 2; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:344px;margin-top:-172px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",-163);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano1.appendChild(span)
	}
	pano.appendChild(pano1);

	var pano2 = document.createElement("div");
	pano2.className = "pano";
	css(pano2,"translateX",20.225);
	css(pano2,"translateZ",-14.695);
	for(var i = 0; i < 3; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:326px;margin-top:-163px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",278);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano2.appendChild(span)
	}
	pano.appendChild(pano2);

	var pano3 = document.createElement("div");
	pano3.className = "pano";
	css(pano3,"translateX",22.175);
	css(pano3,"translateZ",-11.35);
	for(var i = 0; i < 4; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:195px;margin-top:-97.5px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",192.5);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano3.appendChild(span)
	}
	pano.appendChild(pano3);

	var pano4 = document.createElement("div");
	pano4.className = "pano";
	css(pano4,"translateX",20.225);
	css(pano4,"translateZ",14.695);
	startDeg = 90;
	for(var i = 0; i < 5; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:468px;margin-top:-234px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",129);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano4.appendChild(span)
	}
	pano.appendChild(pano4);

	var pano5 = document.createElement("div");
	pano5.className = "pano";
	css(pano5,"translateX",-4.54);
	css(pano5,"translateZ",9.91);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:444px;margin-top:-222px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",-13);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano5.appendChild(span)
	}
	pano.appendChild(pano5);

	var pano6 = document.createElement("div");
	pano6.className = "pano";
	css(pano6,"translateX",-11.35);
	css(pano6,"translateZ",22.275);
	startDeg = 18;
	for(var i = 0; i < 6; i++){
		var span = document.createElement("span");
		span.style.cssText = "height:582px;margin-top:-291px;";
		span.style.background = "url("+imgData["pano"][nub]+")";
		css(span,"translateY",256);
		css(span,"rotateY",startDeg);
		css(span,"translateZ",-R);
		nub++;
		startDeg -= deg;
		pano6.appendChild(span)
	}
	pano.appendChild(pano6);
	setTimeout(function(){
		MTween({
			el:pano,
			target: {
				rotateY: 25,
				scale:100
			},
			time: 1200,
			type: "easeBoth"
		});
	},2800);
}