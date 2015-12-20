var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var index = 0;

var MainSection = React.createClass({
  getInitialState: function () {
    return {
      allItems: {}
    };
  },

  render: function() {
    var itemLists = [];
    var allItems = this.state.allItems;
    var deleteItem = this._deleteItem;
    // build MAX_COLUMN columns of lists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(allItems, function (item) {
        return Number(item.column) === i;
      });
      itemLists.push(<ItemList key={i} index={i} items={propItems} deleteItem={deleteItem}/>);
    });

    return (
      <div>
        <div className='col-sm-4'>
          <ItemForm
            onSubmit={this._saveItem}
          />
          <SearchBox/>
        </div>
        <div className='col-sm-8'>
          {itemLists}
        </div>
      </div>
    );
  },

  /*
   * add a new item to items and update the list
   * @param {object} new item
  */
  _saveItem: function (item) {
    var allItems = this.state.allItems;
    item.index = index;
    allItems[index] = item;
    index++;
    this.setState({allItems: allItems});
  },
  /*
   * delete an item from this.state.allItems
   * @param {object} item
  */
  _deleteItem: function (item) {
    var allItems = this.state.allItems;
    delete allItems[item.index];
    this.setState({allItems: allItems});
  }
});
module.exports = MainSection;
