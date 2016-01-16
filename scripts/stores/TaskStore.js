var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var TaskConstants = require('../constants/TaskConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');

const CHANGE_EVENT = 'change';

var _tasks = {}; // collection of all tasks
var _displayTasks = {}; // collection of tasks to show
var _newTask = {name: '', project: null};
var id = 0;

/**
 * Create a task item.
 * @param {object} task
 */
function create(task) {
  var newTask = {
    id: id,
    complete: false,
    name: task.name,
    project: task.project,
    time: 0,
    isRunning: false,
    startDate: null
  };
  _tasks[id] = newTask;
  _displayTasks[id] = newTask;
  console.log(_tasks[id]);
  id++;
}

/**
 * Delete a TODO item.
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
        if (action.task.name !== '') {
          create(action.task);
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
