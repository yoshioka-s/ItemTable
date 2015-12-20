var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var allItems = {};  // storage for created items
var index = 0;      // storage index of a new item

var MainSection = React.createClass({
  getInitialState: function () {
    return {
      items: {}
    };
  },

  render: function() {
    var itemLists = [];
    var items = this.state.items;
    var deleteItem = this._deleteItem;

    // build MAX_COLUMN columns of ItemLists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(items, function (item) {
        return Number(item.column) === i;
      });
      itemLists.push(
        <ItemList
          key={i}
          index={i}
          items={propItems}
          deleteItem={deleteItem}
        />
      );
    });

    return (
      <div>
        <div className='col-sm-4'>
          <ItemForm
            onSubmit={this._saveItem}
          />
        <SearchBox filterBy={this._filterItem}/>
        </div>
        <div className='col-sm-8'>
          {itemLists}
        </div>
      </div>
    );
  },

  /*
   * add a new item to allItems and update the DOM
   * @param {object} new item
  */
  _saveItem: function (item) {
    item.index = index;
    allItems[index] = item;
    index++;
    this.setState({items: allItems});
  },

  /*
   * delete an item from allItems
   * @param {object} item
  */
  _deleteItem: function (item) {
    delete allItems[item.index];
    this.setState({items: allItems});
  },

  /*
   * filter allItems and set displayItem to the result
   * @param {string} string
  */
  _filterItem: function (string) {
    var filteredItems = _.filter(allItems, function (item) {
      return item.name.toLowerCase().indexOf(string.toLowerCase()) > -1;
    });
    this.setState({items: filteredItems});
  }
});
module.exports = MainSection;
