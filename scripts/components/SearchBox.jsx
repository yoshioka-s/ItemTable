var React = require('react');

var Item = React.createClass({
  propTypes: {
    items: React.PropTypes.array
  },

  getInitialState: function () {
    return {
        items: []
    };
  },

  render: function() {
    return (
      <div>
        SEARCH AN ITEM
        <input
          placeholder="SEARCH"/>
      </div>
    );
  }
});
module.exports = Item;
