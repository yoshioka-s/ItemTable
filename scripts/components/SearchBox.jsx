var React = require('react');
var TaskActions = require('../actions/TaskActions.js');

var Task = React.createClass({

  handleSearch: function (e) {
    TaskActions.filter(e.target.value);
    this.props.updateFilter(e.target.value);
  },

  render: function() {
    return (
      <div className='search-box'>
        <i className="icon-search glyphicon glyphicon-search"></i>
        <input
          placeholder="SEARCH"
          onChange={this.handleSearch}>
        </input>
      </div>
    );
  }
});
module.exports = Task;
