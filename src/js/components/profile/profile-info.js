import React, {Component} from 'react';
import Globals from 'globals';
import ProfileSettings from 'components/profile/profile-settings';

class UserInfo extends Component {
	render() {
		const photo = `${Globals.API_USERS}/${this.props.uid}/photo`;
		return (
			<div className='user-profile-info card col-sm-12'>
				<div className='row'>
					<div className='col-sm-3 col-xs-4'>
						<div className='user-profile-image-wrap'>
							<img src={photo} className='user-profile-image' />
						</div>
					</div>
					<div className='col-sm-9 col-xs-8'>
						<h1 className='user-profile-name'>{this.props.name}</h1>
						<div className='user-profile-details'>
							{
								this.props.isSelf 
									? <ProfileSettings {...this.props} />
									: ''
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserInfo;