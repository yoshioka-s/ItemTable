var Promise = require('es6-promise').Promise;
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ProjectConstants = require('../constants/ProjectConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var _ = require('underscore');

const CHANGE_EVENT = 'change';
const PROJECTS_STORAGE = 'projects';
const MAX_PROJECT_ID = 'maxProjectId';

var _projects = {'-1': {name: 'other', id: -1}}; // collection of all tasks
var id = -1;

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
  // sync with the projects storage before updating
  ProjectStore.loadProjects()
  .then(function () {
    id++;
    _projects[id] = newProject;
    newProject.id = id;
    console.log('created');
    // update the storage
    var updateData = {};
    updateData[PROJECTS_STORAGE] = _projects;
    updateData[MAX_PROJECT_ID] = id;
    chrome.storage.sync.set(updateData, function () {
    });
    ProjectStore.emitChange();
  })
  .catch(function (e) {
    id++;
    _projects[id] = newProject;
    console.log('created but error');
    console.error(e);
    ProjectStore.emitChange();
  });
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
   * Get the entire collection of projects.
   * @return {object}
   */
  getAll: function() {
    return _projects;
  },

  /**
   * Load the projects from chrome storage.
   * @return {Promise}
   */
  loadProjects: function () {
    return new Promise(function (resolve, reject) {
      chrome.storage.sync.get([PROJECTS_STORAGE, MAX_PROJECT_ID], function (items) {
        console.log('retrieved projects: ', items);
        _projects = _.isEmpty(items[PROJECTS_STORAGE]) ? _projects : items[PROJECTS_STORAGE];
        id = isNaN(items[MAX_PROJECT_ID]) ? id : Math.max(id, items[MAX_PROJECT_ID]);
        resolve(items);
      });
    });
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
