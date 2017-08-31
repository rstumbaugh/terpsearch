import React, {Component} from 'react';
import Select from 'react-select';

class ProfileToggle extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			active: props.active,
			disabled: false
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			active: nextProps.active,
			disabled: !nextProps.enabled
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
				<Select
					simpleValue
					options={this.props.items.map(item => ({label: item, value: item}))}
					value={this.state.active}
					clearable={false}
					searchable={false}
					disabled={this.state.disabled}
					onChange={this.toggle.bind(this)}
					className='user-profile-toggle'
				/>
			</div>
		)
	}
}

export default ProfileToggle;