var React = require('react');
var Globals = require('globals');

var SidebarItem = React.createClass({
	render: function() {
		return (
			<div onClick={this.props.onClick} 
				 className={'admin-sidebar-item ' + (this.props.active ? 'active' : '')}>
				{Globals.capitalize(this.props.text)}
			</div>
		)
	}
})

module.exports = SidebarItem;