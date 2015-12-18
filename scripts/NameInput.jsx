var React = require('react');

/*
 * input component for new item name
 *
 */
var NameInput = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <input placeholder='ENTER ITEM!'/>
      </div>
    );
  }
});
module.exports = NameInput;
