var React = require('react');
// var _ = require('underscore');
var Item = require('./Item.jsx');

var ItemList = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    index: React.PropTypes.number,
    deleteItem: React.PropTypes.function
  },

  render: function() {
    var deleteItem = this.props.deleteItem;
    var items = this.props.items.map(function (item, i) {
      return (<Item item={item} key={i} deleteItem={deleteItem} isEven={i % 2 === 0}/>);
    });
    var className = 'item-list'
    if (items.length > 7) {
      className += ' overflowed';
    }
    return (
      <div className={className}>
        <h3 className='col-header'>COLUMN {this.props.index + 1}</h3>
        <ul>{items}</ul>
      </div>
    );
  }
});
module.exports = ItemList;
