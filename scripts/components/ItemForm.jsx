var React = require('react');

/*
 * validation for a new item
 * @params {object} item
*/
function isValid (item) {
  return item.name.trim().length > 0 && item.column.length > 0;
}

/*
 * input component for new item name
 *
 */
var ItemForm = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      name: '',
      column: ''
    };
  },

  componentDidMount: function () {
    this.nameInput.focus();
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleColumnChange: function (e) {
    this.setState({column: e.target.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    if (!isValid(this.state)) {
      // set focus on un-filled input
      if (this.state.column.length < 1) {
        this.columnInput.focus();
      } else {
        this.nameInput.focus();
      }
      return;
    }

    this.props.onSubmit(this.state);
    // reset only name
    this.setState({name: ''});
    this.nameInput.focus();
  },

  render: function() {
    console.log(String(!isValid(this.state)));
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
      <select className="column-select"
          name="column"
          ref={ (ref) => this.columnInput = ref }
          value={this.state.column}
          onChange={this.handleColumnChange}>
          <option value="">CHOOSE COLUMN</option>
          <option value="0">1</option>
          <option value="1">2</option>
        </select>
        <span className="caret"/>
        <input className={classNames}
          type="submit"
          value="ADD ITEM"
          // disabled={String(!isValid(this.state))}
          onClick={this.handleSubmit}
        />
    </form>
    );
  }
});
module.exports = ItemForm;
