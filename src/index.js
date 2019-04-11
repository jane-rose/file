import './index.css'
let aInput = document.querySelectorAll('input');
let dragfile = document.querySelector('#drag');
let oUl = document.querySelector('#oUl');
let $ = obj => document.querySelector(obj);

let arr = [], //文件
size = [],   //文件大小
aTitle = []; //名称
aInput.forEach(function(item, index) {
  item.onchange = function () {
    if ( this.value ) {
      if ( this.files.length ) {
        for (let i = 0, len = this.files.length; i < len; i++) {
          let file = this.files[i];
          arr.push(file);
          size.push(file.size);
          aTitle.push(file.name);

          readFile(file);
        }
      }
      this.value = "";
    }
  }
})


dragfile.ondragenter = function () {
  this.innerText = "请释放鼠标";
}
dragfile.ondragover = function (e) {
  e.preventDefault();
  e.stopPropagation();

}

dragfile.ondragleave = function () {
  this.innerText = "请将图片拖放进来"
}

dragfile.ondrop = function (e) {
  e.preventDefault();
  e.stopPropagation();
  for (let i = 0,len = e.dataTransfer.files.length; i < len; i++) {
    let file = e.dataTransfer.files[i];
    console.log(file)
    if (/image/.test(file.type)) {
      arr.push(file);
      size.push(file.size);
      aTitle.push(file.name);
      readFile(file);
    }
  }
  this.innerText = '请将图片拖拽到此区域';
}
//这里如果用let是妹变量提升的
function readFile(files) {
  let blob = new Blob([files]);
  let url = window.URL.createObjectURL(blob);
  let li = document.createElement('li');
  li.innerHTML = `<img src=${url} width="100%" height="100%"/><p></p>`;
  $("#oUl").appendChild(li);

  count();
}
// 计算 图片个数 大小名称
function count() {
    let aLi = $('#oUl').querySelectorAll('li');

    // 图片的个数
    $('#picLen').innerText = arr.length;
    // 图片的总大小

    if(!size[0]){
        $('#picSize').innerText = 0;
    }else{
        $('#picSize').innerText = (eval(size.join('+'))/1024/1024).toFixed(2);
    }
    let aP = $('#oUl').querySelectorAll('p');
    aP.forEach((item,index)=>{
        item.innerHTML = aTitle[index] + '<i></i>';
    })
    del();
}
function del() {
  let aLi = $('#oUl').querySelectorAll("li");
  aLi.forEach((item, index) => {
    item.children[1].children[0].addEventListener("click", function (e) {
      arr.splice(index, 1);
      size.splice(index, 1);
      $('#oUl').removeChild(aLi[index]);
      count();
    })
  })
}

$('.upload').addEventListener("click", function(e) {
  let aLi = $('#oUl').querySelectorAll('li');
  if (arr.length) {
    arr.forEach((item,index) => {
      (function (index) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
          $('#drag').innerText = '图片已上传成功';
          $('#oUl').removeChild(aLi[index]);
          arr.splice(index,1);
        }
        xhr.open('post', './upload.php', true);
        let data = new FormData();
        data.append('file',item);
        xhr.send(data);
      })(index)
    })
  }
})
