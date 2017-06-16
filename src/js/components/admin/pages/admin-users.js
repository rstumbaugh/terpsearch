var React = require('react');

var Users = React.createClass({
	getUsers: function(users) {
		var rows = []

		for (var key in users) {
			rows.push(
				<tr key={key}>
					<td>{users[key].name}</td>
					<td>{users[key].uid}</td>
					<td>{users[key].token.substring(0,5) + '...'}</td>
				</tr>
			)
		}

		return rows;
	},

	render: function() {
		var users = this.props.users;
		var admins = {};

		// users.users has all user info, users.admins just has PK of user
		for (var key in users.admins) {
			admins[key] = users.users[key]
		}

		var userRows = this.getUsers(users.users);
		var adminRows = this.getUsers(admins);

		return (
			<div>
				<h3>Admins</h3>
				<table className='table table-bordered'>
					<tbody>
						<tr>
							<th>Name</th>
							<th>UID</th>
							<th>Access Token</th>
						</tr>
						{adminRows}
					</tbody>
				</table>
				<br/>
				<br/>
				<h3>Users</h3>
				<table className='table table-bordered'>
					<tbody>
						<tr>
							<th>Name</th>
							<th>UID</th>
							<th>Access Token</th>
						</tr>
						{userRows}
					</tbody>
				</table>
			</div>
		)
	}
});


module.exports = Users;