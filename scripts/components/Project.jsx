var React = require('react');
var Item = require('./Item.jsx');
var TaskActions = require('../actions/TaskActions.js');

function showTaskForm(projectIndex) {
  TaskActions.prepareNewTask(projectIndex);
}

var Project = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    index: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired
  },

  render: function() {
    var items = this.props.items.map(function (item, i) {
      return (<Item item={item} key={i} isEven={i % 2 === 0} id={item.id}/>);
    });
    // add a new new item button as a last item
    items.push(<button
                  className="btn btn-sm btn-default"
                  data-toggle="modal"
                  data-target="#newtaskform"
                  onClick={showTaskForm(this.props.index)}/>);

    var className = 'item-list';
    if (items.length > 7) {
      className += ' overflowed'
    }

    return (
      <div className={className}>
        <h3 className='col-header'>{this.props.name}</h3>
        <ul>{items}</ul>
      </div>
    );
  }
});
module.exports = Project;
