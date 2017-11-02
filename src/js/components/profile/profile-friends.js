import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-modal';
import Globals from 'globals';

class ProfileFriends extends Component {
	constructor() {
		super();

		this.state = {
			showModal: false
		}
	}

	toggleModal(showModal) {
		this.setState({ showModal });
	}

	render() {
		const max = this.props.max || (this.props.friends ? this.props.friends.length : 0)
		return (
			<div className='user-profile-friends card'>
				<div className='row'>
					{
						this.props.friends && this.props.friends.length
							? this.props.friends.slice(0,max).map((friend, i) => 
									<ProfileFriendItem {...friend} idx={i} rowSize={3} key={i} />
								)
							: <i className='no-friends'>No friends to display.</i>
					}
				</div>
				{
					this.props.friends && this.props.max && this.props.friends.length > max
					? <div className='user-profile-view-all-friends' onClick={this.toggleModal.bind(this, true)}>
							{`View all friends on TerpSearch (found ${this.props.friends.length})`}
						</div>
					: ''
				}

				<Modal
					isOpen={this.state.showModal}
					onRequestClose={this.toggleModal.bind(this, false)}
					contentLabel='Friends modal'
				>
					<div className='modal-header'>
						<h2>
							Friends on TerpSearch
							<span className='modal-close' onClick={this.toggleModal.bind(this, false)}>&times;</span>
						</h2>
					</div>
					<div className='user-friends-modal modal-body'>
						{
							this.props.friends ? this.props.friends.map((friend, i) => 
								<ProfileFriendItemRow {...friend} key={i} />
							) : ''
						}
					</div>
				</Modal>
			</div>
		)
	}
}

const ProfileFriendItem = props => {
	var url = `${Globals.API_USERS}/${props.id}/photo?size=250`;
	return (
		<Link to={`/user/${props.id}/`}>
			<div className={`user-profile-friend col-xs-6 col-sm-${12 / props.rowSize}`}>
				<div className='user-profile-friend-img-wrap'>
					<img src={url} alt={props.name} className='user-profile-friend-img' />
				</div>
				<p className='user-profile-friend-name'>{props.name}</p>
			</div>
			{
				(props.idx + 1) % props.rowSize == 0 
					? <div className='clearfix visible-md visible-lg'></div> 
					: ''
			}
		</Link>
	)
}

const ProfileFriendItemRow = props => {
	var url = `${Globals.API_USERS}/${props.id}/photo?size=250`;
	return (
		<Link to={`/users/${props.id}`}>
			<div className='user-friend-row'>
				<div className='user-friend-row-img-wrap'>
					<img src={url} className='user-friend-row-img' />
				</div>
				<div className='user-friend-row-name'>
					{props.name}
				</div>
			</div>
		</Link>
				
	)
}

export default ProfileFriends;