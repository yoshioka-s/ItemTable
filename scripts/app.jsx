var React = require('react');
var ReactDOM = require('react-dom');
var MainSection = require('./components/MainSection.jsx');

ReactDOM.render(
  <div>
    <div className='bar col-sm-12'>ADD AN ITEM</div>
    <MainSection/>
  </div>,
  document.getElementById('tableapp')
);
