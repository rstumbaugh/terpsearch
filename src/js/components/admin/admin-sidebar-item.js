import React, {Component} from 'react';
import Globals from 'globals';

class SidebarItem extends Component {
	render() {
		return (
			<div onClick={this.props.onClick} 
				 className={`admin-sidebar-item ${(this.props.active ? 'active' : '')}`}>
				{Globals.capitalize(this.props.text)}
			</div>
		)
	}
}

export default SidebarItem