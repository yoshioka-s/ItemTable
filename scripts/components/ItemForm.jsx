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
    maxProject: React.PropTypes.number.isRequired
  },

  getInitialState: function () {
    return {
      name: '',
      project: 'CHOOSE PROJECT'
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
    var projectOptions = [];
    var handleProjectChange = this.handleProjectChange;
    _.times(this.props.maxProject, function (i) {
      projectOptions.push(
        <li key={i}>
          <a href="#"
            value={i}
            onClick={() => {handleProjectChange(i)}}>
            {i + 1}
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
            {isNaN(this.state.project) ? this.state.project : this.state.project + 1}
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
        />
    </form>
    );
  }
});
module.exports = ItemForm;
