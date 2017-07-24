import React, {Component} from 'react';
import Globals from 'globals';
import ProfileToggle from 'components/profile/profile-toggle';
import ProfileDetailsItem from 'components/profile/profile-details-item';

class UserInfo extends Component {
	toggleEmail(selected) {
		this.props.onEmailChange(selected == 'No');
	}

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
							<ProfileDetailsItem title='Profile'>
								<p className='user-profile-secondary-text'>
									Edit who can and cannot see your profile. Those who can see your profile
									can only view your name, picture, as well as ratings and comments which
									you choose to make public.
								</p>
								<ProfileToggle
									label='Allow others to see your profile?'
									items={['No', 'Yes']}
									active={'Yes'}
									onChange={item => console.log(item)}
								/>
							</ProfileDetailsItem>
							<ProfileDetailsItem title='Email'>
								<p className='user-profile-secondary-text'>
									Your email will remain private. Nobody else will be able to see your personal
									info. 
								</p>
								<a href={`mailto:${this.props.email}`} className='user-profile-email'>
									{this.props.email}
								</a>
								<br/>
								<ProfileToggle
									label='Get updates from TerpSearch via email?'
									items={['No', 'Yes']}
									active={this.props.subscribed ? 'Yes' : 'No'}
									onChange={this.toggleEmail.bind(this)}
								/>
							</ProfileDetailsItem>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default UserInfo;