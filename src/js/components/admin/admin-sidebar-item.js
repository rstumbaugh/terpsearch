var React = require('react');
var Globals = require('../globals.js');

var SidebarItem = React.createClass({
	render: function() {
		return (
			<div onClick={this.props.onClick} 
				 className={'sidebar-item ' + (this.props.active ? 'active' : '')}>
				{Globals.capitalize(this.props.text)}
			</div>
		)
	}
})

module.exports = SidebarItem;