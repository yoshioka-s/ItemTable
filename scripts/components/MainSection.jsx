var React = require('react');
var _ = require('underscore');
var TaskForm = require('./TaskForm.jsx');
var ProjectForm = require('./ProjectForm.jsx');
var Task = require('./Task.jsx');
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
    $('#newTabs a:first').tab('show');
    // bootstarp tab settings
    $('#newTabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
    });
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
    ProjectStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var allProjects = ProjectStore.getAll();
    // var displayTasks = this.state.displayTasks;
    var displayTasks = this.state.allTasks;

    // build Task elements
    var isEven = true;
    var tasks = _.map(displayTasks, function (task, taskId) {
      isEven = !isEven;
      return <Task
        task={task}
        id={taskId}
        isEven={isEven}
        key={taskId}
        />
    });

    return (
      <div>

        <SearchBox
          updateFilter={this._updateFilter}
        />

        <div className='display-section'>
          {tasks}
        </div>

        <button className="btn btn-info"
          data-toggle="modal"
          data-target="#modal-form">
          +
        </button>
        <div className="modal fade modal-dialog"
          id="modal-form"
          role="dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button className="btn btn-sm close-btn"
                data-dismiss="modal">
                x
              </button>
              <h4 className="modal-title">New</h4>
            </div>
            <div  className="modal-body">
              <ul className="nav nav-tabs" role="tablist" id="newTabs">
                <li role="presentation" className="active"><a href="#task" aria-controls="task" role="tab" data-toggle="tab">Task</a></li>
                <li role="presentation"><a href="#project" aria-controls="project" role="tab" data-toggle="tab">Project</a></li>
              </ul>
              <div className="tab-content">
                <div role="tabpanel" className="tab-pane active" id="task">.
                  <TaskForm
                    projects={allProjects}/>
                </div>
                <div role="tabpanel" className="tab-pane" id="project">
                  <ProjectForm/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  /*
   * onChange event of this component
   * set all tasks of the store to this.state to update the view
  */
  _onChange: function() {
    this.setState(getTaskState());
  },
});

module.exports = MainSection;
