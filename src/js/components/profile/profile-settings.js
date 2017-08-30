import React, {Component} from 'react';
import ProfileToggle from 'components/profile/profile-toggle';
import ProfileDetailsItem from 'components/profile/profile-details-item';

class ProfileSettings extends Component {
	render() {
		return (
			<div className='user-profile-settings'>
				<ProfileDetailsItem title='UMD Authorization'>
					<p className='user-profile-secondary-text'>
						You can not contribute any reviews until you log in via UMD's sign-in service.
						TerpSearch does not have access to your directory ID, and we do not store any
						information linked to your student account.
					</p>
					<UmdAuthStatus authorized={this.props.umdAuth} />
				</ProfileDetailsItem>
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
						onChange={this.props.toggleEmail}
					/>
				</ProfileDetailsItem>
			</div>
		)
	}
}

const UmdAuthStatus = props => (
	<div className={`umd-auth-status ${props.authorized ? 'umd-auth-success' : 'umd-auth-failure'}`}>
		{ props.authorized ? 'Authorized' : 'Not yet authorized' }
	</div>
)


export default ProfileSettings;