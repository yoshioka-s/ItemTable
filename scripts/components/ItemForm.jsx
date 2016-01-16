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
var ItemForm = React.createClass({
  propTypes: {
    projects: React.PropTypes.object.isRequired,
    newTask: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      name: '',
      project: {id: this.props.newTask.project}
    };
  },

  componentDidMount: function () {
    this.nameInput.focus();
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleProjectChange: function (project) {
    this.setState({project: project});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (!isValid(this.state)) {
      // set focus on un-filled input
      this.nameInput.focus();
      return;
    }

    TaskActions.create(this.state);
    // reset name
    this.setState({name: ''});
    this.nameInput.focus();
  },

  render: function() {
    console.log(this.state);
    var projectOptions = [];
    var handleProjectChange = this.handleProjectChange;
    _.each(this.props.projects, function (project) {
      projectOptions.push(
        <li key={project.id}>
          <a href="#"
            value={project.id}
            onClick={() => {handleProjectChange(project)}}>
            {project.name}
          </a>
        </li>
      );
    });

    var classNames = 'submit-btn';
    classNames += isValid(this.state) ? ' valid' : ' invalid';

    return (
      <div className="modal fade modal-dialog"
        id="newtaskform"
        role="dialog">

        <form className="item-form"
          onSubmit={this.handleSubmit}>
          <input className="name-input modal-content"
            name="name"
            type="text"
            ref={ (ref) => this.nameInput = ref }
            placeholder="ENTER ITEM"
            value={this.state.name}
            onChange={this.handleNameChange}
          />
          <div className="btn-group project-input">
            <button className="dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              ref={ (ref) => this.projectInput = ref }>
              {this.state.project.id < 0 ? "CHOOSE PROJECT" : this.state.project.name}
              <span className="caret"></span>
            </button>
            <ul className="dropdown-menu">
              {projectOptions}
            </ul>
          </div>
          <input className={classNames}
            type="submit"
            value="ADD ITEM"
            onClick={this.handleSubmit}
            data-dismiss="modal"
          />
      </form>
    </div>
    );
  }
});
module.exports = ItemForm;
