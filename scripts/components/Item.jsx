var React = require('react');
var TaskActions = require('../actions/TaskActions.js');

var Item = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    id: React.PropTypes.number.isRequired,
    isEven: React.PropTypes.bool.isRequired
  },

  handleDelete: function (e) {
    TaskActions.destroy(this.props.id);
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
