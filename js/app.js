window.addEventListener('DOMContentLoaded', function() {
  'use strict';
  let time = ()=>document.getElementById("time").innerHTML = (new Date).toLocaleTimeString();
  time();
  setInterval(time,1000);
  let taskController = new TaskController();
});

class TaskStrage {
  constructor() {
    this.strage = localStorage;
    let tasks = this.strage.getItem('tasks');
    this.tasks = tasks === null ? {count: 0, taskArray: []} : JSON.parse(tasks);
  }

  addTask(args) {
    let time = args.time;
    let content = args.content;
    let count = this.tasks.count++;
    this.tasks.taskArray.unshift({id: count, time: time, content: content});
    this.strage.setItem('tasks', JSON.stringify(this.tasks));
  }

  editTask(args) {
    let id = args.id;
    let time = args.time;
    let content = args.content;
    let task = this.tasks.taskArray.find((task)=> task.id === id);
    task.time = time;
    task.content = content;
    this.strage.setItem('tasks', JSON.stringify(this.tasks));
  }

  deleteTask(args) {
    let id = args.id;
    this.tasks.taskArray.forEach(
      (task,i)=>{if(task.id === id) this.tasks.taskArray.splice(i,1);return;});
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
    this.taskView.createListFromTaskArray.call(this.taskView, this.taskStrage.tasks.taskArray, this.taskClick);
    this.$editBox = document.getElementById("editBox");
    this.$editBox.style.display = "none";
    this.$recordBox = document.getElementById("recordBox");
    this.$selectedTask = null;
    document.getElementById("record").addEventListener('click', this.record);
    document.getElementById("text").addEventListener('keypress', this.keyPressRecord);
    document.getElementById("clear").addEventListener('click', this.clearAll);
    document.getElementById("save").addEventListener('click', this.saveTask);
    document.getElementById("editTime").addEventListener('keypress', this.keyPressSave);
    document.getElementById("editContent").addEventListener('keypress', this.keyPressSave);
    document.getElementById("delete").addEventListener('click', this.deleteTask);
    document.getElementById("cancel").addEventListener('click', this.cancel);
  }

  record() {
    let time = document.getElementById("time").textContent;
    let text = document.getElementById("text").value;
    self.taskStrage.addTask.call(self.taskStrage, ({time:time, content:text}));
    self.taskView.createListFromTaskArray.call(self.taskView, self.taskStrage.tasks.taskArray, self.taskClick);
    document.getElementById("text").value="";
  }

  keyPressRecord(event) {
    if (event.key === "Enter") {
      self.record();
      document.getElementById("text").value="";
    }
  }

  clearAll() {
    self.taskStrage.clearAll.call(self.taskStrage);
    self.taskView.clearAll.call(self.taskView);
  }

  saveTask() {
    let time = document.getElementById("editTime").value;
    let content = document.getElementById("editContent").value;
    self.$selectedTask.innerHTML = `<time>${time}</time>${content}`;
    self.taskStrage.editTask.call(self.taskStrage, {id: parseInt(self.$selectedTask.id), time: time, content: content});
    self.cancel();
  }

  keyPressSave(event) {
    if (event.key === "Enter") {
      self.saveTask();
    }
  }

  deleteTask() {
    self.taskStrage.deleteTask({id: parseInt(self.$selectedTask.id)});
    self.$selectedTask.remove();
    self.$selectedTask = null;
    self.$editBox.style.display = "none";
    self.$recordBox.style.display = "block";
  }

  cancel() {
    self.$selectedTask.removeAttribute("class");
    self.$selectedTask = null;
    self.$editBox.style.display = "none";
    self.$recordBox.style.display = "block";
  }

  taskClick(event) {
    let match = event.currentTarget.innerHTML.match(/<time>(.*)<\/time>(.*)/);
    document.getElementById("editTime").value = match[1];
    document.getElementById("editContent").value = match[2];
    if (self.$selectedTask === event.currentTarget) {
      self.cancel();
    } else if (self.$selectedTask) {
      self.$selectedTask.removeAttribute("class");
      self.$selectedTask = event.currentTarget;
      self.$selectedTask.setAttribute("class", "selected");
    } else {
      self.$selectedTask = event.currentTarget;
      self.$selectedTask.setAttribute("class", "selected");
      self.$editBox.style.display = "block";
      self.$recordBox.style.display = "none";
    }
  }
}

class TaskView {
  constructor() {
    this.$ul = document.getElementById("task");
  }

  createListFromTaskArray(taskArray, listener) {
    let fragment = document.createDocumentFragment();
    taskArray.forEach( (task) => {
      let $li = document.createElement('li');
      $li.innerHTML = `<time>${task.time}</time>${task.content}`;
      $li.setAttribute('id', task.id);
      $li.addEventListener('click', listener);
      fragment.appendChild($li);
    })
    this.$ul.textContent='';
    this.$ul.appendChild(fragment);
  }

  clearAll() {
    this.$ul.textContent='';
  }
}
