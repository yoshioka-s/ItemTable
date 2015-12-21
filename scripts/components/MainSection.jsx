var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var allItems = {0: {index:0, name:'seed1', column: 0},1:{index:1, name:'seed2', column: 0}};  // storage for created items
var index = 0;      // storage index of a new item

/*
 * filter allItems whose name contains the string (case insensitive)
 * @param {string} string
*/
function filterItemsBy(string) {
  return _.filter(allItems, function (item) {
    return item.name.toLowerCase().indexOf(string.toLowerCase()) > -1;
  });
}

var MainSection = React.createClass({
  getInitialState: function () {
    return {
      items: {},
      seachString: ''
    };
  },

  render: function() {
    var itemLists = [];
    var deleteItem = this._deleteItem;
    var displayItems = filterItemsBy(this.state.seachString);

    // build MAX_COLUMN columns of ItemLists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(displayItems, function (item) {
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
        <div className='bar'>ADD AN ITEM</div>
        <div className='input-section'>
          <ItemForm
            onSubmit={this._saveItem}
          />
        <SearchBox
            filterBy={this._filterItem}/>
        </div>
        <div className='display-section'>
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
    // var filteredItems = _.filter(allItems, function (item) {
    //   return item.name.toLowerCase().indexOf(string.toLowerCase()) > -1;
    // });
    // this.setState({items: filteredItems});
    this.setState({seachString: string});
  }
});

module.exports = MainSection;
