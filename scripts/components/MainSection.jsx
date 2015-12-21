var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var allItems = {};  // storage for created items
var index = 0;      // storage index of a new item

/*
 * filter allItems whose name contains the string (case insensitive).
 * this does not filter newly created items
 * @param {string} string
*/
function filterItemsBy(string) {
  return _.filter(allItems, function (item) {
    return item.name.toLowerCase().indexOf(string.toLowerCase()) > -1;
  });
}

/*
 * The main component of the app.
 * keep track of all items created by the user.
 * @param {string} string
*/
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
    var displayItems = this.state.items;
    console.log(displayItems);

    // build MAX_COLUMN columns of ItemLists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(displayItems, function (item, key) {
        console.log(key);
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
            updateFilter={this._updateFilter}/>
        </div>
        <div className='display-section'>
          {itemLists}
        </div>
      </div>
    );
  },

  /*
   * add a new item to both allItems and state.items
   * @param {object} new item
  */
  _saveItem: function (item) {
    item.index = index;
    // update allItems
    allItems[index] = item;
    // add the new item on displaying items
    var displayItems = this.state.items;
    displayItems[index] = item;
    console.log(`saved item! ${item}`);
    index++;
    // update the state
    this.setState({items: displayItems});
  },

  /*
   * delete an item from both allItems and state.items
   * @param {object} item
  */
  _deleteItem: function (item) {
    delete allItems[item.index];
    var displayItems = this.state.items;
    delete displayItems[item.index];
    this.setState({items: displayItems});
  },

  /*
   * filter allItems and set state.items to the result
   * @param {string} string
  */
  _updateFilter: function (string) {
    var displayItems = _.chain(allItems)
      .filter(function (item) {
        console.log(`filter: ${item.index}`);
        return item.name.toLowerCase().indexOf(string.toLowerCase()) > -1;
      }).value();
    console.log(displayItems);
    displayItems = _.chain(displayItems)
      .reduce(function (memo, item) {  // convert the array to an object
        console.log(`reduce: ${item.index}`);
        memo[item.index] = item;
        return memo;
      }, {})
      .value();
    console.log(displayItems);
    this.setState({seachString: string, items: displayItems});
  }
});

module.exports = MainSection;
