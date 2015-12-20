var React = require('react');

var Item = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
  },

  render: function() {
    return (
      <li>
        {this.props.item.name}
      </li>
    );
  }
});
module.exports = Item;
