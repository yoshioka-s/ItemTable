/**
 * TaskActions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var ProjectConstants = require('../constants/ProjectConstants.js');

var ProjectActions = {

  /**
   * @param  {string} projectName
   */
  create: function(projectName) {
    AppDispatcher.handleViewAction({
      actionType: ProjectConstants.CREATE_PROJECT,
      name: projectName
    });
  },

  /**
   * @param  {number} id of the item
   */
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ProjectConstants.DESTROY_PROJECT,
      id: id
    });
  },

  /**
   * @param  {string} word to filter
   */
  filter: function(word) {
    AppDispatcher.handleViewAction({
      actionType: ProjectConstants.FILTER_PROJECT,
      word: word
    });
  }

};

module.exports = ProjectActions;
