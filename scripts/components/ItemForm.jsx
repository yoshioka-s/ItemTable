var React = require('react');
var _ = require('underscore');

/*
 * validation for a new item
 * @params {object} item
*/
function isValid (item) {
  return item.name.trim().length > 0 && item.column > -1;
}

/*
 * input component for new item name
 *
 */
var ItemForm = React.createClass({
  propTypes: {
    maxColumn: React.PropTypes.number.isRequired,
    onSubmit: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    return {
      name: '',
      column: 'CHOOSE COLUMN'
    };
  },

  componentDidMount: function () {
    this.nameInput.focus();
  },

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleColumnChange: function (column) {
    this.setState({column: column});
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
    var columnOptions = [];
    var handleColumnChange = this.handleColumnChange;
    _.times(this.props.maxColumn, function (i) {
      columnOptions.push(
        <li key={i}>
          <a href="#"
            value={i}
            onClick={() => {handleColumnChange(i)}}>
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
        <div className="btn-group column-input">
          <button className="dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            ref={ (ref) => this.columnInput = ref }>
            {isNaN(this.state.column) ? this.state.column : this.state.column + 1}
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            {columnOptions}
          </ul>
        </div>
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
