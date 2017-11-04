import React, {Component} from 'react';
import Store from 'utils/store';
import History from 'utils/history';
import ProfileToggle from 'components/profile/profile-toggle';

class ProfileSettings extends Component {
	handleUmdSignin() {
		if (!this.props.umdAuth) {
			// push current page to history
			// push noClear to retain history on redirect back
			// redirect URL to /auth/redirect page
			var obj = { userId: Store.getItem('userId') };
			var redirectUrl = `${window.location.origin}/auth/redirect`;
			redirectUrl += `?data=${encodeURIComponent(JSON.stringify(obj))}`
			var href = window.location.pathname;
			History.push({href, pageName: 'User'});
			History.push({href: 'noClear', pageName: ''});
			
			window.location.href = redirectUrl;
		}
	}

	render() {
		return (
			<div className='user-profile-settings'>
				<fieldset>
					<legend>
						<span className='glyphicon glyphicon-cog' style={{paddingRight: '3px'}}></span>
						Settings
					</legend>
					<ProfileSettingsItem title='UMD Authorization'>
						<p className='user-profile-secondary-text'>
							You can not contribute any reviews until you log in via UMD's sign-in service.
							TerpSearch does not have access to your directory ID, and we do not store any
							information linked to your student account.
						</p>
						<UmdAuthStatus authorized={this.props.umdAuth} onClick={this.handleUmdSignin.bind(this)} />
					</ProfileSettingsItem>
					<ProfileSettingsItem title='Profile'>
						<p className='user-profile-secondary-text'>
							Edit who can and cannot see your profile. Those who can see your profile
							can only view your name, picture, course ratings, and course comments.
						</p>
						<ProfileToggle
							label='Hide your profile from others?'
							items={['No', 'Yes']}
							active={this.props.public ? 'No' : 'Yes'}
							onChange={this.props.onPublicChange}
							enabled={this.props.publicEnabled}
						/>
					</ProfileSettingsItem>
					<ProfileSettingsItem title='Email'>
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
							onChange={this.props.onEmailChange}
							enabled={this.props.emailEnabled}
						/>
					</ProfileSettingsItem>
				</fieldset>
			</div>
		)
	}
}

const UmdAuthStatus = props => (
	<div onClick={props.onClick}
			 className={`umd-auth-status ${props.authorized ? 'umd-auth-success' : 'umd-auth-failure'}`}>
		{ props.authorized ? 'Authorized' : 'Not yet authorized' }
	</div>
)

const ProfileSettingsItem = props => (
	<div className='user-profile-details-item'>
		<h3 className='user-profile-subheader'>{props.title}</h3>
		{ props.children }
		<hr />
	</div>
)

export default ProfileSettings;