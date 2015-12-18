var React = require('react');

/*
 * input component for new item name
 *
 */
var NameInput = React.createClass({
  getInitialState: function () {
    return {name: ''};
  },
  handleNameChange: function (e) {
    this.setState({name: e.target.value});
  },

  render: function() {
    return (
      <div className="name-input">
        <input
          type="text"
          placeholder="ENTER ITEM"
          value={this.state.name}
          onChange={this.handleNameChange}
        />
      </div>
    );
  }
});
module.exports = NameInput;
