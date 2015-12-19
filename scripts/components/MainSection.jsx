var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var MainSection = React.createClass({
  getInitialState: function () {
    return {
      items: []
    };
  },

  render: function() {
    var itemLists = [];
    var allItems = this.state.items;
    // build MAX_COLUMN columns of lists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(allItems, function (item) {
        return item.column === i;
      });
      itemLists.push(<ItemList key={i} index={i} items={propItems} />);
    });

    return (
      <div>
        <ItemForm
          onSubmit={this._saveItem}
        />
        <div>{itemLists}</div>
        <SearchBox/>
      </div>
    );
  },

  /*
   * add a new item to items and update the list
   * @param {object} new itme
  */
  _saveItem: function (item) {
    this.state.items.push(item);
  }
});
module.exports = MainSection;
