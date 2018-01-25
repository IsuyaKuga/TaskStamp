window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  let time = ()=>document.getElementById("time").innerHTML = (new Date).toLocaleTimeString();
  time();
  setInterval(time,1000);
  var taskController = new TaskController();
});

class TaskStrage {
  constructor() {
    this.strage = localStorage;
    let tasks = this.strage.getItem('tasks');
    this.tasks = tasks === null ? {count: 0, taskArray: []} : JSON.parse(tasks);
  }

  addTask(args) {
    var time = args.time;
    content = args.content;
    var count = this.tasks.count++;
    this.tasks.taskArray.unshift({id: count, time: time, content: content});
    this.strage.setItem('tasks', JSON.stringify(this.tasks));
  }

  clearAll() {
    this.strage.clear();
    this.tasks = {count: 0, taskArray: []};
  }
}

class TaskController {
  constructor() {
    self = this;
    this.taskStrage = new TaskStrage();
    this.taskView = new TaskView();
    this.taskView.show(this.taskStrage.tasks.taskArray);
    this.textView = document.getElementById("text");
    document.getElementById("record").addEventListener('click', this.record);
    document.getElementById("clear").addEventListener('click', this.clearAll);
    document.getElementById("text").addEventListener('keypress', this.keyPress);
  }

  record() {
    var time = document.getElementById("time").textContent;
    var text = document.getElementById("text").value;
    self.taskStrage.addTask({time:time, content:text});
    self.taskView.show.call(self.taskView, self.taskStrage.tasks.taskArray);
    self.textView.value="";
  }

  clearAll() {
    self.taskStrage.clearAll.call(self.taskStrage);
    self.taskView.clearAll.call(self.taskView);
  }

  keyPress(event) {
    if (event.key === "Enter") {
      self.record();
      self.textView.value="";
    }
  }
}

class TaskView {
  constructor() {
    this.taskContainer = document.getElementById("task");
  }

  show(taskArray) {
    this.taskContainer.innerHTML = taskArray.map(function(item){return `<li><time>${item.time}</time>${item.content}</li>`}).join('\n');
  }

  clearAll() {
    this.taskContainer.textContent='';
  }
}
