var list = document.getElementById('con_list');
var right_top = document.getElementById('right_top');
var item1 = right_top.getElementsByClassName('item');
var item2 = right_top.getElementsByClassName('item_none');
var load_line = document.getElementById('load_line');
var txtonclick;
//location.hash = '#path=/音乐/张雨生';
//当前页面数据
var Data = getData(data);
//console.log(Data)
//渲染页面
show(Data);
window.onhashchange = function(){
	//重新拿数据，重新渲染
	Data = getData(data);
    show(Data);
    //加载文件个数
    load_line.innerHTML = '已全部加载，共'+btns.length+'个';
    //右键菜单
    fnMenu();
    //框选函数
    Region();
    //拖拽函数
    fnDrag();
    //文件夹显示个数none
	hide.style.display = '';
	//切换页面去掉功能选项按钮和全选
	itemNone();
	no_all.onoff = false;
	no_all.style.backgroundPosition = '0 0';
}
var sum = list.getElementsByTagName('li');
var listTop = list.getElementsByClassName('list_top');
var btns = list.getElementsByClassName('btn');
var con = document.getElementById('right_top');
var create = con.getElementsByClassName('create')[0];
var item = con.getElementsByClassName('item_none');
var mask = document.getElementById('mask');
var new_txt = document.getElementById('new_txt');
var inp = new_txt.getElementsByTagName('input')[0];
var new_text = document.getElementById('new_text');
var confirm = new_txt.getElementsByTagName('i');
var hint = document.getElementById('hint');
//当前页面文件个数
load_line.innerHTML = '已全部加载，共'+btns.length+'个';
//新建文件夹
//为防止多次点击新建文件夹故用开关限制，直到点击生成结构或者取消方可再次点击
create.onoff = true;
create.onclick = function(){
	inp.value = '新建文件夹';
	//点击新建之前清空所有被选中文件夹，并给其去掉样式
	for(var i=0;i<btns.length;i++){
		btns[i].onoff = false;
		btns[i].parentNode.parentNode.classList.remove('tincts');
	}
	if(this.onoff){
		this.onoff = false;
		//打开遮罩层，为防止在新建过程中点击其它文件夹仍可跳转，导致页面错乱
		mask.style.display = 'block';
		var li = document.createElement('li')
		li.innerHTML = `<div class="list_top"></div>
						<div class="list_bot">
							<a href="javascript:;">-</a>
						</div>
						<span class="list_hover">
							<i class="fa fa-check-circle btn"></i>
						</span>`;
		var as = li.getElementsByTagName('a')[0];
		var a = list.firstElementChild;
		//当页面有文件夹的时候，将结构插入第一个的前面，反之，插入最后
		if(a){
			list.insertBefore(li,a);
		}else{
			list.appendChild(li);
		}
		//文字全被选中
		new_text.select();
		confirm[0].onclick = function(){
			create.onoff = true;
			as.innerHTML = inp.value;
			mask.style.display = '';
			//var obj = {};
			var obj = {
				id:Data.child.length+1,
				name:inp.value,
				type:'file',
				child:[]
			}
			btns.length++;
			Data.child.unshift(obj);
			//提示创建文件夹成功
			hint.style.display = 'block';
			//为何offsetWidth和offsetHeight在点击事件的第一次触发之后显示为0
			hint.style.marginLeft = -(hint.offsetWidth)/2+'px';
			//console.log(hint.offsetWidth)
			hint.innerHTML = '<i class="fa fa-check"></i><span>创建文件夹成功</span>';
			setTimeout(function(){
				hint.style.display = '';
			},1000);
			console.log(Data.child.length);
			console.log(Data)
			Data = getData(data);
			show(Data);
			//新建之后加载文件个数
			load_line.innerHTML = '已全部加载，共'+btns.length+'个';
			//全选和右键菜单调用
			checkall();
			fnMenu();
			//框选函数
			Region();
			//拖拽函数
			fnDrag();
		}
		confirm[1].onclick = function(){
			create.onoff = true;
			list.removeChild(sum[0]);
			mask.style.display = '';
		}
	}
}
//存储新建文件夹的点击事件
var createclick = create.onclick;
//删除
item2[2].onclick = function(){
	for(var i=0;i<btns.length;i++){
		if(btns[i].onoff){
			//存储i值
			var n = i;
			var a = btns[n].parentNode.parentNode;
			list.removeChild(a);
			i--;
			Data.child.splice(n,1)
			//console.log(Data.child.length);
			//console.log(Data)
			hint.style.display = 'block';
			hint.style.marginLeft = -(hint.offsetWidth)/2+'px';
			hint.innerHTML = '<i class="fa fa-check"></i><span>删除成功</span>';
			setTimeout(function(){
				hint.style.display = '';
			},1000);
		}
	}
	checkall();
	itemNone();
	//显示当前文件夹个数
	load_line.innerHTML = '已全部加载，共'+btns.length+'个';
}
//重命名
item2[3].onclick = function(){
	//解绑新建文件夹的点击事件，以防止在重命名文件时仍可新建文件夹，直到重命名成功或者取消再给其还原点击事件
	create.onclick = null;
	for(var i=0;i<btns.length;i++){
		if(btns[i].onoff){
			var a = btns[i].parentNode.parentNode;
			//var b = new_txt.offsetHeight;
			var l = a.offsetLeft;
			var t = a.offsetTop+a.offsetHeight-26;
			//console.log(new_txt.offsetHeight)
			new_txt.style.left = l+'px';
			new_txt.style.top = t+'px';
			mask.style.display = 'block';
			var as = a.getElementsByTagName('a')[0];
			inp.value = as.innerHTML;
			//console.log(i)
			var n = i;
			//文字全被选中
			new_text.select();
			confirm[0].onclick = function(){
				as.innerHTML = inp.value;
				//恢复输入框原来位置
				new_txt.style.cssText = '';
				mask.style.display = '';
				//console.log(n)
				Data.child[n].name = as.innerHTML;
				Data = getData(data);
				show(Data);
				hint.style.display = 'block';
				hint.style.marginLeft = -(hint.offsetWidth)/2+'px';
				hint.innerHTML = '<i class="fa fa-check"></i><span>重命名成功</span>';
				setTimeout(function(){
					hint.style.display = '';
				},1000);
				create.onclick = createclick;
				itemNone();
				//右键菜单执行
				fnMenu();
				hide.style.display = '';
			}
			confirm[1].onclick = function(){
				new_txt.style.cssText = '';
				mask.style.display = '';
				btns[n].parentNode.parentNode.classList.remove('tincts');
				btns[n].onoff = false;
				create.onclick = createclick;
				itemNone();
				//右键菜单执行
				fnMenu();
				hide.style.display = '';
			}
		}
	}
}
//存储重命名点击事件
var itemclick = item2[3].onclick;
//console.log(itemclick)
var no_all = document.getElementById('no_all');
no_all.onoff = false;
//已选中文件夹个数
var hide = document.getElementById('hide_file');
var span = hide.getElementsByTagName('span')[0];
//判定全选函数
function checkall(){
	var m = 0;
	for(var i=0;i<btns.length;i++){
		if(btns[i].onoff){
			m++;
		}
	}
	//console.log(m)
	if(m==btns.length){
		no_all.onoff = true;
		no_all.style.backgroundPosition = '-40px 0';
	}else{
		no_all.onoff = false;
		no_all.style.backgroundPosition = '0 0';
	}
	//当选中文件夹个数>=2的时候，重命名点击事件解绑，并给其透明度，预示不可点击，鼠标默认光标样式
	if(m>=2){
		item2[3].onclick = null;
		item2[3].classList.add('zyh_disabled');
	}else{
		item2[3].onclick = itemclick;
		item2[3].classList.remove('zyh_disabled');
	}
	//当选中文件夹个数>=1的时候，功能选项按钮显示
	if(m>=1){
		itemBlock();
		//显示已点击文件夹个数
		hide.style.display = 'block';
		span.innerHTML = '已选中'+m+'个文件/文件夹';
	}
	//当前页面文件个数为0，则去掉全选勾选，并给其隐藏掉功能选项按钮
	if(m==0){
		no_all.onoff = false;
		no_all.style.backgroundPosition = '0 0';
		itemNone();
		hide.style.display = '';
	}
}
//全选
no_all.onclick = function(){
	if(this.onoff){
		for(var i=0;i<btns.length;i++){
			btns[i].parentNode.parentNode.classList.remove('tincts');
			btns[i].onoff = false;
		}
		itemNone();
		this.onoff = false;
		this.style.backgroundPosition = '0 0';
	}else{
		for(var i=0;i<btns.length;i++){
			btns[i].parentNode.parentNode.classList.add('tincts');
			btns[i].onoff = true;
		}
		itemBlock();
		this.onoff = true;
		this.style.backgroundPosition = '-40px 0';
	}
	checkall();
}
function itemNone(){
	for(var i=0;i<item1.length;i++){
		item1[i].style.display = 'block';
	}
	for(var i=0;i<item2.length;i++){
		item2[i].style.display = 'none';
	}
}
function itemBlock(){
	for(var i=0;i<item1.length;i++){
		item1[i].style.display = 'none';
	}
	for(var i=0;i<item2.length;i++){
		item2[i].style.display = 'block';
	}
}
var conRight = document.getElementById('con_right');
var rightMenu = document.getElementById('right_menu');
var header = document.getElementById('header');
var conLeft = document.getElementById('con_left');
var fileMenu = document.getElementById('file_menu');
var rightLi = rightMenu.getElementsByTagName('li');
var fileLi = fileMenu.getElementsByTagName('li');
fnMenu();
function fnMenu(){
	conRight.oncontextmenu = function(ev){
		//阻止默认右键菜单
		ev.preventDefault();
		//显示右键菜单
		rightMenu.style.display = 'block';
		fileMenu.style.display = '';
		for(var i=0;i<sum.length;i++){
			sum[i].classList.remove('tincts');
			btns[i].onoff = false;;
		}
		//调用全选函数和显示功能选项函数
		itemBlock();
		checkall();
		//限制范围
		var maxL = conRight.offsetWidth-rightMenu.offsetWidth;
		//因为自身样式原因，高度需再减少62
		var maxT = conRight.offsetHeight-rightMenu.offsetHeight-62;
		//console.log(rightMenu.offsetWidth)
		//console.log(rightMenu.offsetHeight)
		//console.log(maxL,maxT)
		var dL = ev.clientX-conLeft.offsetWidth;
		var dT = ev.clientY-header.offsetHeight;
		var l = dL>maxL?maxL:dL;
		var t = dT>maxT?dT-rightMenu.offsetHeight:dT;
		rightMenu.style.left = l +'px';
		rightMenu.style.top = t +'px';
		//console.log(l,t)
		rightLi[2].onclick = function(){
			//刷新
			location.reload();
			rightMenu.style.display = '';
		}
		rightLi[5].onclick = function(){
			//新建文件夹点击事件自执行
			create.onclick();
			rightMenu.style.display = '';
		}
	}
	var conclick = conRight.oncontextmenu;
	for(var i=0;i<sum.length;i++){
		sum[i].index = i;
		sum[i].oncontextmenu = function(ev){
			//阻止默认右键菜单
			ev.preventDefault();
			conRight.oncontextmenu = null;
			//显示右键菜单
			fileMenu.style.display = 'block';
			rightMenu.style.display = '';
			//右键给li加上被选中样式，同时btn的开关也变为true
			//只是单个点击，大清洗肯定是必需的
			for(var i=0;i<sum.length;i++){
				sum[i].classList.remove('tincts');
				btns[i].onoff = false;;
			}
			this.classList.add('tincts');
			btns[this.index].onoff = true;
			//调用全选函数和显示功能选项函数
			itemBlock();
			checkall();
			console.log(this.index)
			var n = this.index;
			console.log(n)
			var L = ev.clientX-conLeft.offsetWidth;
			var T = ev.clientY-header.offsetHeight;
			//console.log(L,T)
			fileMenu.style.left = L +'px';
			fileMenu.style.top = T +'px';
//			for(var i=0;i<listTop.length;i++){
//				listTop[i].onclick = txtonclick;
//			}
//			fileLi[0].onclick = function(){
//				listTop[n].onclick();
//				fileMenu.style.display = '';
//			}
			fileLi[10].onclick = function(){
				item2[3].onclick();
				fileMenu.style.display = '';
			}
			fileLi[11].onclick = function(){
				item2[2].onclick();
				fileMenu.style.display = '';
			}
		}
	}
	document.onclick = function(ev){
		//如果点击的不是菜单上，菜单消失
		if(ev.target.parentNode!=rightMenu){
			rightMenu.style.display = '';
		}
		if(ev.target.parentNode!=fileMenu){
			fileMenu.style.display = '';
			conRight.oncontextmenu = conclick;
		}
	}
}
var region = document.getElementById('region');
var arr;
var arr1 = [];
Region();
//框选函数
function Region(){
	//存放被框选的文件夹
	arr = [];
	//框选区域只发生在文件夹区域
	list.onmousedown = function(ev){
		ev.preventDefault();
		region.style.display = 'block';
		var l1 = ev.clientX;
		var t1 = ev.clientY;
		no_all.onoff = false;
		document.onmousemove = function(ev){
			//全部选定时再做框选动作的清洗
			no_all.style.backgroundPosition = '0 0';
			for(var i=0;i<btns.length;i++){
				sum[i].classList.remove('tincts');
				btns[i].onoff = false;
			}
			var l2 = ev.clientX;
			var t2 = ev.clientY;
			region.style.left = l1>l2?l2+'px':l1+'px';
			region.style.top = t1>t2?t2+'px':t1+'px';
			region.style.width = Math.abs(l1-l2)+'px';
			region.style.height = Math.abs(t1-t2)+'px';
			//框选大清洗
			for(var i=0;i<arr.length;i++){
				arr[i].classList.remove('tincts');
			}
			//开关大清洗
			for(var i=0;i<btns.length;i++){
				btns[i].onoff = false;
			}
			arr = [];
			//框选回退出错，框选个数为1的时候，重命名按钮依然显示不可点击，已用arr.length解决
			for(var i=0;i<sum.length;i++){
				if(duang(region,sum[i])){
					//存储i值，赋给btns
					var n = i;
					console.log(n)
					sum[i].classList.add('tincts');
					btns[n].onoff = true;
					arr.push(sum[i]);
					//console.log(arr)
					//调用全选函数
					checkall();
				}
			}
			//用arr的length判断来执行重命名的可点击
			if(arr.length==1){
				item2[3].onclick = itemclick;
				item2[3].classList.remove('zyh_disabled');
			}
			if(!arr.length){
				//arr无数据，隐藏功能选项按钮
				itemNone();
				//同时清洗btns的开关
				for(var i=0;i<btns.length;i++){
					btns[i].onoff = false;
				}
				//文件夹显示个数none
				hide.style.display = '';
			}
			//框选文件夹显示个数
			if(arr.length>=1){
				hide.style.display = 'block';
				span.innerHTML = '已选中'+arr.length+'个文件/文件夹';
			}
		}
		document.onmouseup = function(ev){
			//在鼠标抬起时记录框选的数据
			for(var i=0;i<sum.length;i++){
				if(duang(region,sum[i])){
					var Data1 = getData(data);
					console.log(Data1);
					Data1.child.forEach(function(a,b){
						//判断数据索引值和框选的文件夹索引值
						if(b==i){
							arr1.push(a);
						}
					})
					console.log(arr1);
				}
			}
			document.onmousemove = document.onmouseup = null;
			region.style.cssText = '';
			fnDrag();
		}
	}
}
//碰撞函数
function duang(obj1,obj2){
	var pos1 = obj1.getBoundingClientRect();
	var pos2 = obj2.getBoundingClientRect();
	if(pos1.right<pos2.left || pos1.bottom<pos2.top || pos1.left>pos2.right || pos1.top>pos2.bottom){
		return false;
	}else{
		return true;
	}
}
var drag = document.getElementById('drag');
fnDrag();
function fnDrag(){
	for(var i=0;i<sum.length;i++){
		sum[i].onmousedown = function(ev){
			ev.cancelBubble = true;
			ev.preventDefault();
			for(var i=0;i<btns.length;i++){
				if(arr.includes(this) && btns[i].onoff){
					document.onmousemove = function(ev){
						//鼠标按下移动时拖拽图标显现
						var dL = ev.clientX-conRight.getBoundingClientRect().left;
						var dT = ev.clientY-conRight.getBoundingClientRect().top;
						drag.style.left = dL+'px';
						drag.style.top = dT+'px';
						drag.style.display = 'block';
						drag.innerHTML = `<i class="fa fa-file-o"></i><span>${arr.length}</span>`;
						//console.log(arr);
						for(var i=0;i<sum.length;i++){
							sum[i].className = '';
						}
						for(var i=0;i<sum.length;i++){
							if(!arr.includes(sum[i]) && duang(sum[i],drag)){
								sum[i].className = 'tinct';
							}
						}
					}
					document.onmouseup = function(){
						for(var i=0;i<sum.length;i++){
							if(!arr.includes(sum[i]) && duang(sum[i],drag)){
								var Data1 = getData(data);
								//console.log(Data1)
								Data1.child.forEach(function(a,b){
									//向碰撞到的文件夹添加数据
									if(b==i){
										for(var j=0;j<arr1.length;j++){
											a.child.push(arr1[j]);
										}
									}
								})
								console.log(arr1)
								//在数据中删除选中的数据
								for(var j=0;j<Data1.child.length;j++){
									for(var k=0;k<arr1.length;k++){
										if(Data1.child[j] == arr1[k]){
											console.log(j);
											Data1.child.splice(j,1);
											j--;
										}
									}
								}
								//清空数组
								arr1 = [];
								//渲染页面
								show(Data1);
							}
						}
						//全选函数
						checkall();
						//抬起后隐藏功能选项(无论是有碰撞操作还是在拖拽过程中未执行碰撞操作)
						itemNone();
						//显示当前文件夹个数
						load_line.innerHTML = '已全部加载，共'+btns.length+'个';
						//已选中文件夹个数none
						hide.style.display = '';
						//全选按钮为false
						no_all.onoff = false;
						no_all.style.backgroundPosition = '0 0';
						drag.style.display = '';
						document.onmousemove = document.onmouseup = null;
					}
				}
			}
		}
	}
}
