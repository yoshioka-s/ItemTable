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
  console.log('test!');
  console.log(taskName, projectId);
  // sync with the tasks storage before update
  TaskStore.loadTasks()
  .then(function () {
    console.log('loaded');
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
    var updateData = {maxId: id};
    updateData[TASKS_STORAGE] = _tasks;
    updateData[MAX_TASK_ID] = id;
    console.log('save task');
    chrome.storage.sync.set(updateData, function () {
      console.log('saved: ', _tasks);
    });
    TaskStore.emitChange();
  })
  .catch(function (e) {
    console.error(e);
  });
}

/**
 * Delete a task.
 * @param {string} id
 */
function destroy(id) {
  console.log('destoroy', id);
  console.log(_tasks);
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
  var task = _tasks[id];
  task.isRunning = true;
  task.startDate = new Date();
}

/**
 * Stop running a task.
 * @param {number} id
 */
function stop(id) {
  var task = _tasks[id];
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
        TaskStore.emitChange();
        break;

      case TaskConstants.FILTER:
        filterByName(action.word);
        TaskStore.emitChange();
        break;

      case TaskConstants.RUN:
        run(action.id);
        TaskStore.emitChange();
        break;

      case TaskConstants.STOP:
        stop(action.id);
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
