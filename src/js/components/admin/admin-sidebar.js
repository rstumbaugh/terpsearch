var React = require('react');
var SidebarItem = require('./admin-sidebar-item.js');

var AdminSidebar = React.createClass({
	getInitialState: function() {
		return {
			active: ''
		}
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			active: nextProps.active
		})
	},

	handleClick: function(item) {
		this.setState({
			active: item
		})

		this.props.onActiveChange(item);
	},

	render: function() {
		var items = [];

		for (var i = 0; i < this.props.items.length; i++) {
			items.push(
				<SidebarItem 
					key={i}
					text={this.props.items[i]} 
					active={this.props.items[i] == (this.state.active || this.props.default)}
					onClick={this.handleClick.bind(this, this.props.items[i])}
				/>
			)
		}

		return (
			<div className='sidebar'>
				{items}
			</div>
		)
	}
})

module.exports = AdminSidebar;