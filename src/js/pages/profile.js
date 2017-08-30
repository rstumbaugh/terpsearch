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
			isSelf: Store.getItem('userId') == uid
		}
	}

	componentDidMount() {
		this.getUserInfo();
	}

	componentWillReceiveProps(props) {
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
				console.log(user)
			})
			.catch(err => {
				console.error(err)
			})
	}

	// toggle user email subscribe status
	toggleEmail(isUnsubscribing) {
		var url = isUnsubscribing
			? `${Globals.API_USERS}/${this.state.uid}/unsubscribe`
			: `${Globals.API_USERS}/${this.state.uid}/subscribe`;

		Ajax.post(url, {
			headers: {
				'Authorization': Store.getItem('userToken')
			},
			body: {}
		}).then(Auth.handleAuthResponse)
			.then(() => {
				this.getUserInfo();
			})
			.catch(err => {
				console.error(err);
			})
	}

	render() {
		var friends = this.state.user.friends;
		friends = friends ? friends.concat(friends) : friends;
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
								isSelf={this.state.isSelf}
								onEmailChange={this.toggleEmail.bind(this)}
								umdAuth={this.state.user.umdAuth}
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
								friends={friends}
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