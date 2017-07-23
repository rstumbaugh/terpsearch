import React, {Component} from 'react';
import Globals from 'globals';

class ProfileFriends extends Component {
	render() {
		const max = this.props.max || (this.props.friends ? this.props.friends.length : 0)
		return (
			<div className='user-profile-friends card'>
				<div className='row'>
					{
						this.props.friends && this.props.friends.length
							? this.props.friends.slice(0,max).map((friend, i) => 
									<ProfileFriendItem {...friend} idx={i} key={i} />
								)
							: <i className='no-friends'>No friends to display.</i>
					}
				</div>
				{
					this.props.friends && this.props.friends.length > max
					? <div className='row'>
							<a href='#'>
								{`View all friends on TerpSearch (found ${this.props.friends.length})`}
							</a>
						</div>
					: ''
				}
			</div>
		)
	}
}

const ProfileFriendItem = props => {
	var url = `${Globals.API_USERS}/${props.id}/photo?size=250`;
	return (
		<div>
			<div className='user-profile-friend col-md-4'>
				<div className='user-profile-friend-img-wrap'>
					<img src={url} alt={props.name} className='user-profile-friend-img' />
				</div>
				<p className='user-profile-friend-name'>{props.name}</p>
			</div>
			{
				(props.idx + 1) % 3 == 0 
					? <div className='clearfix visible-md visible-lg'></div> 
					: ''
			}
		</div>
	)
}

export default ProfileFriends;