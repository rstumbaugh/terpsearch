var React = require('react');

var Feedback = React.createClass({
	getFeedback: function(feedback) {
		var rows = [];

		var sortedKeys = Object.keys(feedback).sort(function(a,b) {
			return feedback[a].timestamp < feedback[b].timestamp ? 1 : -1;
		})
		
		for (var i = 0; i < sortedKeys.length; i++) {
			var key = sortedKeys[i];
			var item = feedback[key];
			var time = new Date(item.timestamp).toString('h:mm tt MMM dd yyyy');

			rows.push(
				<tr key={key}>
					<td>{item.message}</td>
					<td>{item.email}</td>
					<td>{time}</td>
					<td>
						<button className='btn btn-danger' onClick={this.props.removeItem.bind(null, 'feedback', key)}>
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
						<th>Feedback</th>
						<th>Email</th>
						<th>Time</th>
						<th></th>
					</tr>
					{this.getFeedback(this.props.feedback)}
				</tbody>
			</table>
		)
	}
});


module.exports = Feedback;

