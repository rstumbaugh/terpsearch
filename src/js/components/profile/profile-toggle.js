import React, {Component} from 'react';

class ProfileToggle extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			active: props.active
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			active: nextProps.active
		})
	}

	toggle(active) {
		this.setState({ active });
		this.props.onChange(active);
	}

	render() {
		return (
			<div className='user-profile-toggle'>
				<span className='user-profile-toggle-label'>{this.props.label}</span>
				<ul className='user-profile-toggle-items'>
					{
						this.props.items.map(item => {
							var className = `user-profile-toggle-item ${
								this.props.active == item ? 'active' : ''
							}`;
							
							return (
								<li className={className} onClick={this.toggle.bind(this, item)} key={item}>
									{item}
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
}

export default ProfileToggle;