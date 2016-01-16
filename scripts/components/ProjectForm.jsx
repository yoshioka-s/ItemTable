var React = require('react');
var _ = require('underscore');
var ProjectActions = require('../actions/ProjectActions');

/*
 * validation for a new item
 * @params {object} project
*/
function isValid (project) {
  return project.name.trim().length > 0;
}

/*
 * input component for new item name
 *
 */
var ProjectForm = React.createClass({

  getInitialState: function () {
    return {
      name: ''
    };
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (!isValid(this.state)) {
      // set focus on un-filled input
      this.nameInput.focus();
      return;
    }

    ProjectActions.create(this.state.name);
    // reset name
    this.setState({name: ''});
  },

  render: function() {
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
      <div className='project-section col-sm-2'>
        <button className="btn btn-info"
          data-toggle="modal"
          data-target="#project-form">
          +
        </button>
        <div className="modal fade modal-dialog"
          role="dialog"
          id="project-form">
          <div className="modal-content">
            <div class="modal-header">
              <button className="btn btn-sm close-btn"
                data-dismiss="modal">
                x
              </button>
              <h4 class="modal-title">Modal Header</h4>
            </div>
            <form className="modal-body"
              onSubmit={this.handleSubmit}>
              <input className="name-input"
                name="name"
                ref={ (ref) => this.nameInput = ref }
                placeholder="ENTER PROJECT NAME"
                value={this.state.name}
                onChange={this.handleNameChange}
              />
              <input className={classNames}
                data-dismiss="modal"
                type="submit"
                value="ADD PROJECT"
                onClick={this.handleSubmit}
              />
            </form>
          </div>

        </div>
      </div>
    );
  }
});
module.exports = ProjectForm;
