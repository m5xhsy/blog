function getImageDataURL(image) {
    // 创建画布
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    // 以图片为背景剪裁画布
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // 获取图片后缀名
    const extension = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
    // 某些图片 url 可能没有后缀名，默认是 png
    return canvas.toDataURL('image/' + extension, 1);
}


function downLoad(downloadName, url) {
    const tag = document.createElement('a');
    // 此属性的值就是下载时图片的名称，注意，名称中不能有半角点，否则下载时后缀名会错误
    tag.setAttribute('download', downloadName.replace(/\./g, '。'));

    const image = new Image();
    // 设置 image 的 url, 添加时间戳，防止浏览器缓存图片
    image.src = url + '?time=' + new Date().getTime();
    //重要，设置 crossOrigin 属性，否则图片跨域会报错
    image.setAttribute('crossOrigin', 'Anonymous');
    // 图片未加载完成时操作会报错
    image.onload = () => {
        tag.href = getImageDataURL(image);
        tag.click();
    };
}

function copy(text) {
    var inp = document.createElement('input'); // create input标签
    document.body.appendChild(inp) // 添加到body中
    inp.value = text// 给input设置value属性为需要copy的内容
    inp.select(); // 选中
    document.execCommand('copy', false); // copy已经选中的内容
    inp.remove(); // 删除掉这个dom
}
var oElement;
var selectionText;

var right_button = {
    flag: 0,  //0刷新，1保存，2复制
    darkModeString: "",
    readModeString: "",

    initRightButton: function () {
        if (document.getElementById("readmode") === null)/* 主页没有阅读模式 */
            document.getElementById("ReadMode").parentElement.style.display = "none";
        
        if (window.location.pathname === "/")
            document.getElementById("GoHome").parentElement.style.display = "none";

        this.updateReadModeString();
        this.updateDarkModeString();
        document.getElementById("ReadMode").innerText = this.readModeString;
        document.getElementById("DarkMode").innerText = this.darkModeString;
    },
    goHome() {
        window.location.pathname = "/";
    },
    backToTop() {
        document.getElementById("go-up").click();
    },
    switchDarkMode() {
        document.getElementById("darkmode").click();
        this.updateDarkModeString();
        document.getElementById("DarkMode").innerText = this.darkModeString;
    },
    switchReadMode() {
        if (/read-mode/i.test(document.body.classList.value))
            document.getElementsByClassName("exit-readmode")[0].click();
        else
            document.getElementById("readmode").click();

        this.updateReadModeString();
        document.getElementById("ReadMode").innerText = this.readModeString;
    },
    selectGeneralOptions() {
        if (this.flag == 0)
            window.location.reload();
        else if (this.flag == 1)
            downLoad("m5xhsy-" + new Date().getTime(), oElement.src);
        else
            copy(selectionText);

    },
    updateReadModeString() {
        this.readModeString = /read-mode/i.test(document.body.classList.value) ? "🍍 退 出 阅 读" : "🍍 阅 读 模 式";
    },
    updateDarkModeString() {
        this.darkModeString = document.documentElement.getAttribute("data-theme") === "dark" ? "🍉 浅 色 模 式" : "🍉 深 色 模 式";
    }
};


window.oncontextmenu = function (e) {
    var pox = 0, poy = 0;

    if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))
        return;

    var GeneralOptions = document.getElementById("GeneralOptions")
    selectionText = window.getSelection().toString();
    oElement = document.elementFromPoint(event.x, event.y);
    if (oElement.tagName == "IMG") {
        flag = 1;
        GeneralOptions.innerText = "🍌 保 存 图 片"
    } else if (selectionText) {
        GeneralOptions.innerText = "🍌 复 制 文 字"
        flag = 2;
    } else {
        GeneralOptions.innerText = "🍌 刷 新 一 下";
        flag = 0
    }

    //取消默认的浏览器自带右键
    e.preventDefault();
    var evt = window.event || arguments[0];
    var menu = document.getElementById('right_menu');
    right_button.initRightButton();
    menu.style.display = "block"
    var menuH = menu.offsetHeight
    var menuW = menu.offsetWidth
    menu.style.display = "none"

    // var container = document.getElementById('container');


    /*获取当前鼠标右键按下后的位置，据此定义菜单显示的位置*/
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    pox = evt.clientX;
    poy = evt.clientY - 74 + scrollTop;
    if (pox + menuW > document.documentElement.clientWidth) {
        // pox = document.documentElement.clientWidth - menu.offsetWidth - 3 //3是菜单栏阴影
        pox = pox - menuW
    }
    if (poy - scrollTop + menuH > document.documentElement.clientHeight) {
        poy = poy - menuH + 74
    }

    if (poy - scrollTop < 0) {
        poy = scrollTop - 15
    }

    /*设置菜单可见*/
    menu.style.left = pox + "px";
    menu.style.top = poy + "px";
    menu.style.display = "block";
}


window.onscroll = function () {
    document.getElementById('right_menu').style.display = 'none';
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
}

window.onclick = function (e) {
    //关闭右键菜单
    document.getElementById('right_menu').style.display = 'none';
    //用户触发click事件就可以关闭了，因为绑定在window上，按事件冒泡处理，不会影响菜单的功能
}

