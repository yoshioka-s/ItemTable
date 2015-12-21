var React = require('react');
var Validation = require('react-validation');
var validator = require('validator');

Validation.extendErrors({
  isRequired: {
    message: 'required',
    rule: function (value) {
      return Boolean(validator.trim(value));
    }
  }
});

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

  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  handleColumnChange: function (e) {
    this.setState({column: e.target.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
    this.setState(this.getInitialState());
  },

  render: function() {
    return (
      <Validation.Form className="item-form"
        onSubmit={this.handleSubmit}>
        <Validation.Input className="name-input"
          name="name"
          blocking='input'
          validations={[
            {rule: 'isRequired',errorMessage: 'mandatory field'}
          ]}
          placeholder="ENTER ITEM"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <Validation.Select className="column-select"
          name="column"
          value={this.state.column}
          validations={[
            {rule: 'isRequired',errorMessage: 'mandatory field'}
          ]}
          onChange={this.handleColumnChange}>
          <option value="">CHOOSE COLUMN</option>
          <option value="0">1</option>
          <option value="1">2</option>
        </Validation.Select>
        <span className="caret"/>
        <Validation.Button className="submit-btn"
          type="submit"
          value="ADD ITEM"
          blocking="button"
          onClick={this.handleSubmit}
        />
      </Validation.Form>
    );
  }
});
module.exports = ItemForm;
