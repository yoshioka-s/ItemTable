var React = require('react');
var TaskActions = require('../actions/TaskActions.js');
var util = require('../helpers/util.js');

var Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired,
    isEven: React.PropTypes.bool.isRequired
  },

  handleDelete: function (e) {
    TaskActions.destroy(this.props.id);
  },

  handleRun: function (e) {
    if (this.props.task.isRunning) {
      TaskActions.stop(this.props.id);
    } else {
      TaskActions.run(this.props.id);
    }
  },

  render: function() {
    var color = this.props.isEven ? 'even' : 'odd';
    if (this.props.task.isRunning) {
      color = 'running';
    }

    return (
      <li className={`item ${color}`}>
        {this.props.task.name}
        <span className="time"> ({util.millisecondToString(this.props.task.time)})</span>
        <span className="btn run-btn btn-info"
          onClick={this.handleRun}
        >
          run/stop
        </span>
        <span className="btn del-btn"
          onClick={this.handleDelete}
        >
          <i className="glyphicon glyphicon-remove"></i>
        </span>
      </li>
    );
  }
});

module.exports = Task;
