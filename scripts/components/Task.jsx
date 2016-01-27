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

  handleComplete: function (e) {
    TaskActions.complete(this.props.id);
  },

  handleRun: function (e) {
    TaskActions.run(this.props.id);
  },

  handlePause: function (e) {
    TaskActions.pause(this.props.id);
  },

  render: function() {
    var color = this.props.isEven ? 'even' : 'odd';
    if (this.props.task.isRunning) {
      color = 'running';
    }

    return (
      <div className={`item ${color} col-sm-6`}>
        {this.props.task.name}
        <span className="btn del-btn"
          onClick={this.handleDelete}
        >
          <i className="glyphicon glyphicon-remove"></i>
        </span>
        <span className={`btn comp-btn ${this.props.task.complete ? 'hide' : ''}`}
          onClick={this.handleComplete}
        >
          <i className="glyphicon glyphicon-ok"></i>
        </span>
        <span className={`btn run-btn ${this.props.task.isRunning || this.props.task.complete ? 'hide' : ''}`}
          onClick={this.handleRun}
        >
          <i className="glyphicon glyphicon-play"></i>
        </span>
        <span className={`btn run-btn ${!this.props.task.isRunning || this.props.task.complete ? 'hide' : ''}`}
          onClick={this.handlePause}
        >
          <i className="glyphicon glyphicon-pause"></i>
        </span>
        <br/>
        <span className="time"> ({util.millisecondToString(this.props.task.time)})</span>
      </div>
    );
  }
});

module.exports = Task;
