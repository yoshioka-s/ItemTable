var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var TaskConstants = require('../constants/TaskConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');

const CHANGE_EVENT = 'change';
const TASKS_STORAGE = 'tasks';
const MAX_TASK_ID = 'maxTaskId';

var _tasks = {}; // collection of all tasks
var _displayTasks = {}; // collection of tasks to show
var _newTask = {name: '', project: null};
var id = 0;

/**
 * Create a new task.
 * @param {object} task
 */
function create(taskName, projectId) {
  // sync with the tasks storage before update
  TaskStore.loadTasks()
  .then(() => {
    id++;
    let newTask = {
      id: id,
      complete: false,
      name: taskName,
      projectId: projectId,
      time: 0,
      isRunning: false,
      startDate: null,
      bookmarks: []
    };
    _tasks[id] = newTask;
    // save in chrome data store
    let updateData = {};
    updateData[TASKS_STORAGE] = _tasks;
    updateData[MAX_TASK_ID] = id;
    chrome.storage.sync.set(updateData, () => {
      // do nothing
    });
    TaskStore.emitChange();
  });
}

/**
 * Delete a task.
 * @param {string} id
 */
function destroy(id) {
  delete _tasks[id];
  delete _displayTasks[id];
}

/**
 * Filter tasks. (case insensitive)
 * @param {string} word
 */
function filterByName(word) {
  _displayTasks = _.chain(_tasks)
  .filter( (task) => {
    return task.name.toLowerCase().indexOf(word.toLowerCase()) > -1;
  })
  .reduce( (memo, task) => {
    memo[task.id] = task;
    return memo;
  }, {})
  .value();
}

/**
 * Start running a task.
 * @param {number} id
 */
function run(id) {
  // puase the running task
  _.each(_tasks, (task, taskId) => {
    if (task.isRunning) {
      puase(taskId);
    }
  });
  // mark the task as running
  let task = _tasks[id];
  task.isRunning = true;
  task.startDate = new Date().getTime();
  // open its bookmarks
  openBookmarks(id);
}

/**
 * Pause a running task.
 * @param {number} id
 */
function complete(id) {
  var task = _tasks[id];
  if (task.isRunning) {
    puase(id);
  }
  task.complete = true;
}

/**
 * Mark the task as completed.
 * @param {number} id
 */
function puase(id) {
  let task = _tasks[id];
  task.isRunning = false;
  task.time += new Date() - task.startDate;
}

/**
 * Set project id to a new task.
 * @param {number} projectId
 */
function prepare(projectId) {
  _newTask.project = projectId;
}

/**
 * add active tab to a task bookmark.
 * @param {object} tab data
 * @param {number} id of target task (optional)
 */
function addUrl(tab, id = TaskStore.getRunningTask()) {
  let task = _tasks[id];
  task.bookmarks.push(tab);
}

/**
 * remove the url from a task bookmark.
 * @param {string} url to remove
 * @param {number} id of target task (optional)
 */
function removeUrl(url, id = TaskStore.getRunningTask()) {
  task.bookmarks = _.filter(task.bookmarks, (bookmark) => {
    return bookmark.url !== url;
  });
}

/**
 * update the storage data
 */
function update() {
  let updateData = {};
  // clone the object. otherwise it points to the same object so storage doesn't get updated
  updateData[TASKS_STORAGE] = _.clone(_tasks);
  console.log("UPDATE!!", updateData);
  chrome.storage.sync.set(updateData);
  chrome.storage.sync.get([TASKS_STORAGE], function (items) {
    console.log('UPDATED!!', items);
  });
}

/**
 * open the bookmarks of a task
 * @param {number} task id
 */
function openBookmarks(id) {
  let bookmarks = _tasks[id].bookmarks;
  // open bookmark in a new tab if it's not opened
  chrome.tabs.query({}, (tabs) => {
    _.each(bookmarks, (bookmark) => {
      if (!_.any(tabs, {url: bookmark.url})) {
        window.open(bookmark.url);
      }
    });
  });
 }

var TaskStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of tasks.
   * @return {object}
   */
  getAll: function() {
    return _tasks;
  },

  /**
   * Get the tasks to show.
   * @return {object}
   */
  getDisplay: function() {
    return _displayTasks;
  },

  /**
   * Load the tasks from chrome storage.
   * @return {promise}
   */
  loadTasks: function () {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get([TASKS_STORAGE, MAX_TASK_ID], function (items) {
        console.log('retrieved tasks: ', items);
        _tasks = items[TASKS_STORAGE] || {};
        if (!isNaN(items[MAX_TASK_ID])) {
          id = Math.max(id, items[MAX_TASK_ID]);
        }
        resolve(items);
      });
    });
  },

  /**
   * Get the new task to create.
   * @return {object}
   */
   getNewTask: function () {
     return _newTask;
   },

   /**
   * Get the id of the running task
   * @return {number}
   */
   getRunningTask: function () {
     for (var id in _tasks) {
       if (_tasks[id].isRunning) {
         return id;
       }
     }
     return null;
   },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case TaskConstants.CREATE:
        if (action.taskName !== '') {
          create(action.taskName, action.projectId);
          TaskStore.emitChange();
        }
        break;

      case TaskConstants.DESTROY:
        destroy(action.id);
        update();
        TaskStore.emitChange();
        break;

      case TaskConstants.FILTER:
        filterByName(action.word);
        TaskStore.emitChange();
        break;

      case TaskConstants.RUN:
        run(action.id);
        update();
        TaskStore.emitChange();
        break;

      case TaskConstants.PAUSE:
        puase(action.id);
        update();
        TaskStore.emitChange();
        break;

      case TaskConstants.COMPLETE:
        complete(action.id);
        update();
        TaskStore.emitChange();
        break;

      case TaskConstants.NEW:
        prepare(action.projectId);
        TaskStore.emitChange();
        break;

      case TaskConstants.BOOKMARK:
        addUrl(action.tab, action.id);
        update();
        TaskStore.emitChange();
        break;

      case TaskConstants.UN_BOOKMARK:
        removeUrl(action.url, action.id);
        update();
        TaskStore.emitChange();
        break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = TaskStore;
