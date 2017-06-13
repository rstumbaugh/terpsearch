import React from 'react';

class SearchComponent extends React.Component {
	render() {
		return (
			<div className='form-group'>
				<label>{this.props.labelText}</label>
				{this.props.component}
				{this.props.subcomponent}
			</div>
		)
	}
}	

export default SearchComponent;