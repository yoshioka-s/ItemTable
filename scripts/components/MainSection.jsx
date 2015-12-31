var React = require('react');
var _ = require('underscore');
var ItemForm = require('./ItemForm.jsx');
var ItemList = require('./ItemList.jsx');
var SearchBox = require('./SearchBox.jsx');
var TaskStore = require('../stores/taskStore.js');

const MAX_COLUMN = 2;

var allItems = {};  // storage for created items
var index = 0;      // storage index of a new item

function getTaskState() {
  return {
    allTasks: TaskStore.getAll(),
    displayTasks: TaskStore.getDisplay()
  };
}

/*
 * The main component of the app.
 * keep track of all items created by the user.
 * @param {string} string
*/
var MainSection = React.createClass({
  getInitialState: function () {
    return getTaskState();
  },

  componentDidMount: function() {
    TaskStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TaskStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var itemLists = [];
    var deleteItem = this._deleteItem;
    var displayItems = this.state.displayTasks;

    // build MAX_COLUMN columns of ItemLists
    _.times(MAX_COLUMN, function (i) {
      // build ItemList for column i
      var propItems = _.filter(displayItems, function (item, key) {
        return Number(item.project) === i;
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
            maxProject={MAX_COLUMN}
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
   * onChange event of this component
   * set all tasks of the store to this.state to update the view
   * @param {object} new item
  */
  _onChange: function() {
    this.setState(getTaskState());
  },
});

module.exports = MainSection;
