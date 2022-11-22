var dataMap = [];

function copy(str, notice) {
	var textarea = document.createElement("textarea");
	textarea.value = str;
	document.body.append(textarea);
	textarea.select();
	document.execCommand("Copy");
	textarea.remove();
	notice && alert(notice);
	notice && console.log(notice, str);
}

function download(file) {
	file = getData(file);
	var a = document.createElement("a");
	a.download = file.name;
	a.href = file.src;
	a.style.display = "none";
	document.body.append(a);
	setTimeout(() => {
		console.log(`正在下载文件(${new Date().toLocaleString()})\n${file.detail}`);
		a.click();
		a.remove();
	}, 50)
}

function getData(dom) {
	return dataMap.filter((e) => {
		return e.obj === dom
	})[0] || {}
}

function imgClick(dom, sg, db) {
	var timer = null;
	dom.onclick = function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			clearTimeout(timer);
			typeof sg === "function" && sg(dom);
		}, 200)
	}
	dom.ondblclick = function() {
		clearTimeout(timer);
		typeof db === "function" && db(dom);
	}
}
window.onload = function() {
	document.querySelectorAll("img").forEach((e) => {
		var path = decodeURI(new URL(e.src).pathname),
			name = path.split("/").slice(-1)[0],
			type = name.split(".")[1].toUpperCase(),
			size = `${e.naturalWidth} x ${e.naturalHeight}`,
			detail = `图片名称: ${name.replace(`.${type}`,"")}\n图片格式: ${type}\n分辨率: ${size}\n路径: ${path}`;
		e.title = detail + "\n(点击复制地址,双击下载文件)"
		e.style.cursor = "pointer";
		imgClick(e, (dom) => {
			copy(dom.src, "已复制图片地址");
		}, (dom) => {
			download(dom);
		})
		dataMap.push({
			obj: e,
			src: e.src,
			path: path,
			name: name,
			type: type,
			size: size,
			detail: detail
		});
	})
}
