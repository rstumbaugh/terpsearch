var React = require('react');

var SidebarItem = React.createClass({
	render: function() {
		return (
			<div onClick={this.props.onClick} 
				 className={'sidebar-item ' + (this.props.active ? 'active' : '')}>
				{this.props.text}
			</div>
		)
	}
})

module.exports = SidebarItem;