var React = require('react');
var _ = require('underscore');
var TaskActions = require('../actions/TaskActions.js');

/*
 * validation for a new item
 * @params {object} item
*/
function isValid (item) {
  return item.name.trim().length > 0;
}

/*
 * input component for new item name
 *
 */
var TaskForm = React.createClass({
  propTypes: {
    projects: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      name: '',
      projectId: -1
    };
  },

  componentDidMount: function () {
    this.nameInput.focus();
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleProjectChange: function (project) {
    console.log('change');
    console.log(project);
    this.setState({projectId: project.id});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (!isValid(this.state)) {
      // set focus on un-filled input
      this.nameInput.focus();
      return;
    }

    TaskActions.create(this.state.name, this.state.projectId);
    // reset name
    this.setState({name: ''});
    this.nameInput.focus();
  },

  render: function() {
    var projectOptions = [];
    var handleProjectChange = this.handleProjectChange;
    _.each(this.props.projects, function (project, projectId) {
      projectOptions.push(
        <li key={projectId}>
          <a href="#"
            value={projectId}
            onClick={() => {handleProjectChange(project)}}>
            {project.name}
          </a>
        </li>
      );
    });

    var classNames = 'submit-btn';
    classNames += isValid(this.state) ? ' valid' : ' invalid';

    return (
      <form className="item-form"
        onSubmit={this.handleSubmit}>
        <input className="name-input"
          name="name"
          type="text"
          placeholder="ENTER TASK NAME"
          ref={ (ref) => this.nameInput = ref }
          value={this.state.name}
          onChange={this.handleNameChange}
        />

        <div className="btn-group project-input">
          <button className="dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ref={ (ref) => this.projectInput = ref }>
            {this.state.projectId < 0 ? "CHOOSE PROJECT" : this.props.projects[this.state.projectId].name}
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            {projectOptions}
          </ul>
        </div>

        <input className={classNames}
          type="submit"
          value="ADD TASK"
          onClick={this.handleSubmit}
          data-dismiss="modal"
        />
      </form>
    );
  }
});
module.exports = TaskForm;
