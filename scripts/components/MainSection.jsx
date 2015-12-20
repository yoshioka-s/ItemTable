var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');

const MAX_COLUMN = 2;

var MainSection = React.createClass({
  getInitialState: function () {
    return {
      allItems: []
    };
  },

  render: function() {
    var itemLists = [];
    var allItems = this.state.allItems;
    // build MAX_COLUMN columns of lists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(allItems, function (item) {
        return Number(item.column) === i;
      });
      itemLists.push(<ItemList key={i} index={i} items={propItems} />);
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
   * @param {object} new itme
  */
  _saveItem: function (item) {
    var allItems = this.state.allItems.concat(item);
    this.setState({allItems: allItems});
  }
});
module.exports = MainSection;
