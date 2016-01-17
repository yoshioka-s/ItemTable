var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ProjectForm = require('./ProjectForm.jsx');
var Project = require('./Project.jsx');
var SearchBox = require('./SearchBox.jsx');
var TaskStore = require('../stores/TaskStore');
var ProjectStore = require('../stores/ProjectStore');

function getTaskState() {
  return {
    allTasks: TaskStore.getAll(),
    displayTasks: TaskStore.getDisplay(),
    allProjects: ProjectStore.getAll()
  };
}

/*
 * The main component of the app.
 * keep track of all items created by the user.
 * @param {string} string
*/
var MainSection = React.createClass({
  getInitialState: function () {
    return getTaskState();
  },

  componentWillMount: function () {
    var loaded = false;
    var compoent = this;
    // setState if projects and tasks are both loaded
    function updateState() {
      if (loaded) {
        compoent.setState(getTaskState());
      }
      loaded = true;
    }

    TaskStore.loadTasks()
    .then(function () {
      updateState();
    });
    ProjectStore.loadProjects()
    .then(function () {
      updateState();
    });
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var projects = [];
    var displayTasks = this.state.displayTasks;

    // build Project elements
    _.each(ProjectStore.getAll(), function (project, projectId) {
      console.log(projectId, project);
      var propItems = _.filter(displayTasks, function (item, key) {
        return Number(item.project.id) === project.id;
      });
      projects.push(
        <div className='col-sm-2'
             key={projectId} >
          <Project
            name={project.name}
            index={projectId}
            items={propItems}
          />
        </div>
      );
    });

    return (
      <div>

        <SearchBox
          updateFilter={this._updateFilter}
        />

        <ItemForm
          projects={ProjectStore.getAll()}
          newTask={TaskStore.getNewTask()}
        />


        <div className='display-section'>
          {projects}
        </div>
        <div >
          <ProjectForm/>
        </div>
      </div>
    );
  },

  /*
   * onChange event of this component
   * set all tasks of the store to this.state to update the view
   * @param {object} new item
  */
  _onChange: function() {
    this.setState(getTaskState());
  },
});

module.exports = MainSection;
