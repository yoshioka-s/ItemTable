var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var EventEmitter = require('events').EventEmitter;
var TaskConstants = require('../constants/TaskConstants');
var assign = require('object-assign');
var _ = require('underscore');

const CHANGE_EVENT = 'change';

var _tasks = {}; // collection of all tasks
var _displayTasks = {}; // collection of tasks to show
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
    project: task.project
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

    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = TaskStore;
