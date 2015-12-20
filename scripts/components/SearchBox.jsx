var React = require('react');

var Item = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    filterBy: React.PropTypes.function
  },

  getInitialState: function () {
    return {
        items: []
    };
  },

  handleSearch: function (e) {
    this.props.filterBy(e.target.value);
  },

  render: function() {
    return (
      <div>
        SEARCH AN ITEM
        <input
          placeholder="SEARCH"
          onChange={this.handleSearch}/>
      </div>
    );
  }
});
module.exports = Item;
