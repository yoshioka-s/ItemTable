var React = require('react');

var Item = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    index: React.PropTypes.number,
    key: React.PropTypes.number
  },
  getInitialState: function () {
    return {
        name: '',
        column: ''
    };
  },

  render: function() {
    return (
      <li>
        {this.state.name} x
      </li>
    );
  }
});
module.exports = Item;
