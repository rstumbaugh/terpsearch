import React, {Component} from 'react';
import Ajax from 'utils/ajax';
import Store from 'utils/store';
import Auth from 'utils/auth';
import Globals from 'globals';
import {Header, Content, Footer} from 'utils/layout';
import ProfileInfo from 'components/profile/profile-info';
import ProfileCourses from 'components/profile/profile-courses';
import ProfileFriends from 'components/profile/profile-friends';


class Profile extends Component {
	constructor(props) {
		super(props);
		
		var uid = props.match.params.userId;
		this.state = {
			user: {},
			uid: uid,
			isSelf: Store.getItem('userId') == uid,
			emailEnabled: true,
			publicEnabled: true
		}
	}

	componentDidMount() {
		Globals.scrollTop();
		this.getUserInfo();
	}

	componentWillReceiveProps(props) {
		Globals.scrollTop();
		var uid = props.match.params.userId;
		this.setState({ 
			uid, 
			isSelf: Store.getItem('userId') == uid 
		}, () => this.getUserInfo());
	}

	getUserInfo() {
		var url = `${Globals.API_USERS}/${this.state.uid}/profile`;
		Ajax.get(url, { 'Authorization': Store.getItem('userToken') })
			.then(res => JSON.parse(res.response))
			.then(user => {
				this.setState({ user });
			})
			.catch(err => {
				console.error(err)
			})
	}

	// toggle user email subscribe status
	toggleEmail(subscribe) {
		var url = subscribe === 'Yes'
			? `${Globals.API_USERS}/${this.state.uid}/subscribe`
			: `${Globals.API_USERS}/${this.state.uid}/unsubscribe`;

		// disable dropdown until server response received
		this.setState({
			emailEnabled: false
		})

		Ajax.post(url, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
			body: {}
		}).then(Auth.handleAuthResponse)
			.then(() => {
				var user = this.state.user;
				user.getUpdates = subscribe == 'Yes';
				this.setState({
					user,
					emailEnabled: true
				})
			})
			.catch(err => {
				console.error(err);
			})
	}

	// toggle user public prop -- to show profile or don't show
	togglePublic(isHidden) {
		var pub = isHidden == 'No';
		var url = `${Globals.API_USERS}/${this.state.uid}/togglePublic?public=${pub}`;

		this.setState({
			publicEnabled: false
		})
		
		Ajax.post(url, {
			headers: {
				'Authorization': Store.getItem('userToken')
			}, 
			body: {}
		}).then(Auth.handleAuthResponse)
			.then(() => {
				var user = this.state.user;
				user.public = pub;
				this.setState({
					user,
					publicEnabled: true
				})
			})
			.catch(err => {
				console.error(err);
			})
	}

	updateSchedule(newSchedule) {
		var user = this.state.user;
		if (!user.schedule) {
			user.schedule = {};
		}
		user.schedule.courses = newSchedule;
		this.setState({ user });

		Ajax.post(`${Globals.API_USERS}/${this.state.uid}/schedule`, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
			body: { schedule: newSchedule }
		}).then(Auth.handleAuthResponse)
			.then(() => {
				console.log('schedule updated');
			})
	}

	render() {
		return (
			<div>
				<Header />
				<Content offset>
					<div className='user-profile-wrap row'>
						<div className='user-profile-info-wrap col-sm-12'>
							<ProfileInfo
								name={this.state.user.name}
								email={this.state.user.email}
								uid={this.state.uid}
								subscribed={this.state.user.getUpdates}
								public={this.state.user.public}
								isSelf={this.state.isSelf}
								onPublicChange={this.togglePublic.bind(this)}
								onEmailChange={this.toggleEmail.bind(this)}
								emailEnabled={this.state.emailEnabled}
								publicEnabled={this.state.publicEnabled}
								umdAuth={this.state.user.umdAuth}
								schedule={this.state.user.schedule}
								onScheduleUpdate={this.updateSchedule.bind(this)}
							/>
						</div>
						<div className='user-profile-section section col-md-7 left'>
							<h1 className='user-profile-heading section-heading'>Courses</h1>
							<ProfileCourses
								ratings={this.state.user.ratings}
								comments={this.state.user.comments}
								isSelf={this.state.isSelf}
								name={this.state.user.name}
								max={3}
							/>
						</div>
						<div className='user-profile-section section col-md-5 right'>
							<h1 className='user-profile-heading section-heading'>Friends</h1>
							<ProfileFriends 
								friends={this.state.user.friends}
								max={6}
							/>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Profile;