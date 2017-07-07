import React, {Component} from 'react';
import SidebarItem from './admin-sidebar-item';

class AdminSidebar extends Component {
	constructor() {
		super();

		this.state = {
			active: ''
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			active: nextProps.active
		})
	}

	handleClick(item) {
		this.setState({
			active: item
		})

		this.props.onActiveChange(item);
	}

	render() {
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
			<div className='admin-sidebar-wrap'>
				<div className='admin-sidebar row'>
					{items}
				</div>
			</div>
		)
	}
}


export default AdminSidebar;