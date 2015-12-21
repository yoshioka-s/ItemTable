var React = require('react');

var Item = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    isEven: React.PropTypes.bool.isRequired,
    deleteItem: React.PropTypes.func.isRequired
  },

  handleDelete: function (e) {
    this.props.deleteItem(this.props.item);
  },

  render: function() {
    var color = this.props.isEven ? 'even' : 'odd';

    return (
      <li className={`item ${color}`}>
        {this.props.item.name}
        <span className="btn del-btn"
          onClick={this.handleDelete}
          >
          <i className="glyphicon glyphicon-remove"></i>
        </span>
      </li>
    );
  }
});
module.exports = Item;
