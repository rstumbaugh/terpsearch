var React = require('react');

var Emails = React.createClass({

	getEmails: function(emails) {
		var rows = [];

		for (var key in emails) {
			rows.push(
				<tr key={key}>
					<td>{emails[key]}</td>
					<td>
						<button className='btn btn-danger' onClick={this.props.removeItem.bind(null, 'emails', key)}>
							<i className='glyphicon glyphicon-remove'></i>
						</button>
					</td>
				</tr>
			)
		}
		return rows;
	},

	render: function() {
		return (
			<table className='table table-bordered'>
				<tbody>
					<tr>
						<th>{'Emails (' + Object.keys(this.props.emails).length + ' found)'}</th>
						<th></th>
					</tr>
					{this.getEmails(this.props.emails)}
				</tbody>
			</table>
		)
	}
});


module.exports = Emails;