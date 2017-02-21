var React = require('react');

var Header = React.createClass({
	render: function() {
		return (
			<div id='header' className={'nav-header-wrap' + (this.props.white ? '-white' : '')}>
	            <a href="index.html">TerpSearch</a>
	        </div>
		)
	}
})

module.exports = Header;