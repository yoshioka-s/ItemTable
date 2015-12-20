var React = require('react');
var Item = require('./Item.jsx');

var ItemList = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    index: React.PropTypes.number,
    key: React.PropTypes.number
  },
  getInitialState: function () {
    return {
      items: []
    };
  },

  render: function() {
    var items = this.state.items.map(function (item) {
      return (<Item>{item.name} x</Item>);
    });
    return (
      <div className='col-sm-6'>
        <h3>COLUMN {this.props.index + 1}</h3>
        <ul>{items}</ul>
      </div>
    );
  }
});
module.exports = ItemList;
