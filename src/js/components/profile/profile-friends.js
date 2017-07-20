import React, {Component} from 'react';
import Globals from 'globals';

class ProfileFriends extends Component {
	render() {
		return (
			<div className='user-profile-friends card'>
				<div className='row'>
					{
						this.props.friends && this.props.friends.length
							? this.props.friends.map(friend => 
									<ProfileFriendItem {...friend} key={friend.id} />
								)
							: <i className='no-friends'>No friends to display.</i>
					}
				</div>
			</div>
		)
	}
}

const ProfileFriendItem = props => {
	var url = `${Globals.API_USERS}/${props.id}/photo`;
	return (
		<div className='user-profile-friend col-md-4'>
			<div className='user-profile-friend-img-wrap'>
				<img src={url} alt={props.name} className='user-profile-friend-img' />
			</div>
			<p className='user-profile-friend-name'>{props.name}</p>
		</div>
	)
}

export default ProfileFriends;