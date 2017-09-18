//根据hash处理的路径，拿到页面要渲染的数据
function getData(data){
	var hash = location.hash.substr(1);
	//#path=/音乐/张雨生
	if(hash){
		//['path','/音乐/张雨生']
		//['','音乐','张雨生']
		//['音乐','张雨生']
		var path = hash.split('=')[1].split('/').slice(1);
		var target = null;
		fn(data,path)
		return target;
	}else{
		return data;
	}
	function fn(data,path){
		//console.log(data.child)
		data.child.forEach(function(a){
			if(a.name==path[0]){
				path.shift();
				if(path.length==0){
					target = a;
				}else{
					fn(a,path);
				}
			}
		})
	}
}
function show(data){
	list.innerHTML = '';
	data.child.forEach(function(a){
		createli(a);
	})
}
function createli(data){
	var li = document.createElement('li');
	var div = document.createElement('div');
	div.className = 'list_top';
	li.appendChild(div);
	var div = document.createElement('div');
	div.className = 'list_bot';
	div.innerHTML = '<a href="javascript:;">'+data.name+'</a>';
	li.appendChild(div);
	var span = document.createElement('span');
	span.className = 'list_hover';
	span.innerHTML = '<i class="fa fa-check-circle btn"></i>';
	li.appendChild(span);
	list.appendChild(li);
	var btn = li.getElementsByClassName('btn')[0];
	var txt = li.getElementsByTagName('a')[0];
	li.onmouseenter = function(){
		this.classList.add('tinct');
	}
	li.onmouseleave = function(){
		this.classList.remove('tinct');
	}
	//添加class名来模拟选中
	btn.onoff = false;
	btn.onclick = function(){
		if(this.onoff){
			li.classList.remove('tincts');
			//隐藏功能选项按钮
			itemNone();
			this.onoff = false;
		}else{
			li.classList.add('tincts');
			//显示功能选项按钮
			itemBlock();
			this.onoff = true;
		}
		checkall();
	}
	var list_top = li.getElementsByClassName('list_top')[0];
	var a = li.getElementsByClassName('a')[0];
	list_top.onclick = txt.onclick = function(){
		var hash = location.hash.substr(1);
		//console.log(hash)
		if(hash){
			var path = hash.split('=')[1];
			//console.log(path)
			location.hash = '#path='+path+'/'+data.name;
		}else{
			location.hash = '#path='+'/'+data.name;
		}
		//切换页面去掉功能选项按钮，若上级页面有全选，清理掉全选
		itemNone();
		no_all.onoff = false;
		no_all.style.backgroundPosition = '0 0';
	}
	txtonclick = txt.onclick
}
