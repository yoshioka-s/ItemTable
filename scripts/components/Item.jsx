var React = require('react');

var Item = React.createClass({
  propTypes: {
    item: React.PropTypes.object,
    deleteItem: React.PropTypes.function
  },

  handleDelete: function (e) {
    this.props.deleteItem(this.props.item);
  },

  render: function() {
    return (
      <li>
        {this.props.item.name}
        <span className="del-btn pull-right"
          onClick={this.handleDelete}
          >X</span>
      </li>
    );
  }
});
module.exports = Item;
