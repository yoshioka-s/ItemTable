var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ProjectConstants = require('../constants/ProjectConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');

const CHANGE_EVENT = 'change';

var _projects = {99: {name: 'dummy', id: 99}}; // collection of all tasks
var id = 0;

/**
 * Create a project.
 * @param {string} name
 */
function create(name) {
  var newProject = {
    id: id,
    complete: false,
    name: name,
    time: 0,
    isRunning: false,
    startDate: null
  };
  _projects[id] = newProject;
  console.log(_projects[id]);
  id++;
}

/**
 * Delete a Project.
 * @param {string} id
 */
function destroy(id) {
  delete _projects[id];
}

var ProjectStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of tasks.
   * @return {object}
   */
  getAll: function() {
    return _projects;
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
      case ProjectConstants.CREATE_PROJECT:
        if (action.name !== '') {
          create(action.name);
          ProjectStore.emitChange();
        }
        break;

      case ProjectConstants.DESTROY_PROJECT:
        destroy(action.id);
        ProjectStore.emitChange();
        break;

      default:
        // do nothing
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = ProjectStore;
