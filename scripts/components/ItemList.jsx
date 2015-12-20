var React = require('react');
// var _ = require('underscore');
var Item = require('./Item.jsx');

var ItemList = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    index: React.PropTypes.number,
    key: React.PropTypes.number
  },

  render: function() {
    var items = this.props.items.map(function (item, i) {
      return (<Item item={item} key={i}/>);
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
