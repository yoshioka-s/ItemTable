var React = require('react');

var Item = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    updateFilter: React.PropTypes.function
  },

  getInitialState: function () {
    return {
        items: []
    };
  },

  handleSearch: function (e) {
    this.props.updateFilter(e.target.value);
  },

  render: function() {
    return (
      <div className='search-box'>
        SEARCH AN ITEM
        <i className="icon-search glyphicon glyphicon-search"></i>
        <input
          placeholder="SEARCH"
          onChange={this.handleSearch}>
        </input>
      </div>
    );
  }
});
module.exports = Item;
