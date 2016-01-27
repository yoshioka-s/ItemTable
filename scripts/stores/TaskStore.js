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
 * Create a task.
 * @param {object} task
 */
function create(taskName, projectId) {
  // sync with the tasks storage before update
  TaskStore.loadTasks()
  .then(function () {
    id++;
    var newTask = {
      id: id,
      complete: false,
      name: taskName,
      projectId: projectId,
      time: 0,
      isRunning: false,
      startDate: null
    };
    _tasks[id] = newTask;
    // save in chrome data store
    var updateData = {};
    updateData[TASKS_STORAGE] = _tasks;
    updateData[MAX_TASK_ID] = id;
    chrome.storage.sync.set(updateData, function () {
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
  .filter(function (task) {
    return task.name.toLowerCase().indexOf(word.toLowerCase()) > -1;
  })
  .reduce(function (memo, task) {
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
  console.log(_tasks);
  _.each(_tasks, function (task, taskId) {
    if (task.isRunning) {
      puase(taskId);
    }
  });
  // mark the task as running
  var task = _tasks[id];
  task.isRunning = true;
  task.startDate = new Date().getTime();
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
  var task = _tasks[id];
  task.isRunning = false;
  console.log(task.startDate);
  task.time += new Date() - task.startDate;
  console.log('pause');
  console.log(task.time);
}

/**
 * Set project id to a new task.
 * @param {number} projectId
 */
function prepare(projectId) {
  _newTask.project = projectId;
}

/**
 * update the storage data
 */
function update() {
  var updateData = {};
  updateData[TASKS_STORAGE] = _tasks;
  console.log('update!', updateData);
  chrome.storage.sync.set(updateData);
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
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = TaskStore;
