import React from 'react';

class ProfileDetailsItem extends React.Component {
	render() {
		return (
			<div className='user-profile-details-item'>
				<h3 className='user-profile-subheader'>{this.props.title}</h3>
				{ this.props.children }
				<hr />
			</div>
		)
	}
}

export default ProfileDetailsItem;