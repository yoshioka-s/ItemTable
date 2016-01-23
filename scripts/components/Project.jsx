var React = require('react');
var Task = require('./Task.jsx');
var TaskActions = require('../actions/TaskActions.js');

function showTaskForm(projectIndex) {
  TaskActions.prepareNewTask(projectIndex);
}

var Project = React.createClass({
  propTypes: {
    tasks: React.PropTypes.array,
    index: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired
  },

  render: function() {
    var tasks = this.props.tasks.map(function (task, i) {
      return (<Task task={task} key={i} isEven={i % 2 === 0} id={task.id}/>);
    });

    var className = 'project';
    if (tasks.length > 7) {
      className += ' overflowed'
    }

    return (
      <div className={className}>
        <h3 className='col-header'>{this.props.name}</h3>
        <ul>{tasks}</ul>
      </div>
    );
  }
});
module.exports = Project;
