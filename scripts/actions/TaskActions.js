/**
 * TaskActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var TaskConstants = require('../constants/TaskConstants.js');

var TodoActions = {

  /**
   * @param  {object} task
   */
  create: function(task) {
    AppDispatcher.handleViewAction({
      actionType: TaskConstants.CREATE,
      task: task
    });
  },

  /**
   * @param  {number} id of the item
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

};

module.exports = TodoActions;
