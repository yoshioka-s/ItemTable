/**
 * TaskActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var TaskConstants = require('../constants/TaskConstants.js');

var TaskActions = {

  /**
   * @param  {object} task
   */
  create: function(taskName, projectId) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.CREATE,
      taskName: taskName,
      projectId: projectId
    });
  },

  /**
   * @param  {number} id of the task
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.DESTROY,
      id: id
    });
  },

  /**
   * @param  {string} word to filter
   */
  filter: function(word) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.FILTER,
      word: word
    });
  },

  /**
   * @param  {number} id of the task
   */
  run: function(id) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.RUN,
      id: id
    });
  },

  /**
   * @param  {number} id of the task
   */
  pause: function(id) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.PAUSE,
      id: id
    });
  },

  /**
   * @param  {number} id of the task
   */
  complete: function (id) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.COMPLETE,
      id: id
    });
  },

  /**
   * @param  {number} projectId of the new task
   */
  prepareNewTask: function(projectId) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.PREPARE,
      projectId: projectId
    });
  }

};

module.exports = TaskActions;
