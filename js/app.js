window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  show();
  time();
  setInterval('time()',1000);
});

var storage = localStorage;

function time(){
  var now = new Date();
  document.getElementById("time").innerHTML = now.toLocaleTimeString();
}

function show() {
  var taskContainer = document.getElementById("task");
  var arr = storage.getItem('list');
  if (arr === null) {
    arr = [];
  } else {
    arr = JSON.parse(arr);
  }
  taskContainer.innerHTML=arr.join('\n');
}

function record(){
  var time = document.getElementById("time").innerHTML; 
  var text = document.getElementById("text").value;
  var list = document.getElementById("task");
  var string ='<li><time>'+time+'</time>'+text+'</li>';

  var arr = storage.getItem('list');
  if (arr === null) {
    arr = [];
  } else {
    arr = JSON.parse(arr);
  }

  arr.unshift(string);
  list.innerHTML=arr.join('\n');

  storage.setItem('list', JSON.stringify(arr));
  
  document.getElementById("text").value = '';
}
function clearStorage(){
  var list = document.getElementById("task");

  storage.clear();
  list.innerHTML='';
}
function handleBtnKeyPress(event) {
  if (event.key === "Enter") {
    record();
  }
}
window.onload = function () {
};

