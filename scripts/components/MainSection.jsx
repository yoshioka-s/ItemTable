var React = require('react');
var _ = require('underscore');
var TaskForm = require('./TaskForm.jsx');
var ProjectForm = require('./ProjectForm.jsx');
var Task = require('./Task.jsx');
var SearchBox = require('./SearchBox.jsx');
var TaskActions = require('../actions/TaskActions.js');
var TaskStore = require('../stores/TaskStore');
var ProjectStore = require('../stores/ProjectStore');
var util = require('../helpers/util.js');

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
    var hasLoaded = {tasks:false, projects: false};
    var compoent = this;
    // setState if projects and tasks both have been loaded
    function updateState() {
      if (_.every(hasLoaded, _.indentity)) {
        compoent.setState(getTaskState());
      }
    }

    TaskStore.loadTasks()
    .then(function () {
      hasLoaded.tasks = true;
      updateState();
    });
    ProjectStore.loadProjects()
    .then(function () {
      hasLoaded.projects = true;
      updateState();
    });

    // check if current tab is bookmarked in the running task
    var runningTask = this.state.allTasks[TaskStore.getRunningTask()];
    util.getCurrentTab()
    .then(function (currentTab) {
      console.log('runnning: ', runningTask);
      var bookmarks = runningTask.bookmarks;
      console.log('bookmarks: ', bookmarks);
      compoent.setState({
        isBookmarked: _.any(bookmarks, (bookmark) => {
          currentTab.url === bookmark.url;
        })
      });
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

  handleStar: function () {
    util.getCurrentTab()
    .then( (currentTab) => {
      TaskActions.bookmarkActiveTab(currentTab);
      this.setState({isBookmarked: true});
    })
  },

  handleRemoveStar: function () {
    util.getCurrentTab()
    .then( (currentTab) => {
      TaskActions.removeBookmark(currentTab.url);
      this.setState({isBookmarked: false});
    });
  },

  render: function() {
    console.log('render!');
    var allProjects = ProjectStore.getAll();
    // var displayTasks = this.state.displayTasks;
    var displayTasks = this.state.allTasks;
    var runningTask = displayTasks[TaskStore.getRunningTask()];
    var star;
    if (runningTask) {
      if (this.state.isBookmarked) {
        star =
        <span
          className="btn star-btn"
          onClick={this.handleRemoveStar}
        >
          <i className="glyphicon glyphicon-star"></i>
          remove from reference list of {runningTask.name}
        </span>
      } else {
        star =
        <span
          className="btn star-btn"
          onClick={this.handleStar}
        >
          <i className="glyphicon glyphicon-star-empty"></i>
          add to reference list of {runningTask.name}
        </span>
      }
    }

    // build Task elements
    var isEven = false;
    var tasks = _.map(displayTasks, (task, taskId) => {
      if (isNaN(taskId)) {
        console.log(taskId, 'is in task id!!');
      }
      isEven = !isEven;
      return <Task
        task={task}
        id={parseInt(taskId)}
        isEven={isEven}
        key={taskId}
        />
    });

    return (
      <div className='row'>
        {runningTask ? 'You are working so hard!' : 'Tasks are waiting for you...'}
        <p className='star-space'>
          {star}
        </p>
        <SearchBox
          updateFilter={this._updateFilter}
        />

        <div className='display-section'>
          {tasks}
        </div>

        <button className="btn btn-info"
          data-toggle="modal"
          data-target="#modal-form">
          New Task / Project
        </button>

        <div className="modal fade modal-dialog"
          id="modal-form"
          role="dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button className="btn btn-sm close-btn"
                data-dismiss="modal">
                <i className="glyphicon glyphicon-remove"></i>
              </button>
              <h4 className="modal-title">Add New Task</h4>
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
