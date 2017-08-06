import React, {Component} from 'react';
import Globals from 'globals';

class Logs extends Component {
	getLogs(logs) {
		var rows = [];

		// sort logs by time
		logs.sort((a,b) => a.time > b.time ? -1 : 1)

		for (var i = 0; i < logs.length; i++) {
			var log = logs[i];
			var c = log.content;
			var type = log.type;
			var content;
			var time = Globals.formatDate(log.time);

			// decide what to display based on log type
			if (log.type == 'rating') {
				content = c.course_id + ': Diff = ' + c.difficulty + ', Int = ' + c.interest 
							+ ' (' + c.professor + ')';
			} else if (log.type == 'comment') {
				content = c.course_id + ': ' + c.comment;
			} else if (log.type == 'search') {
				content = c;
			} else {
				content = c;
			}

			rows.push(
				<tr key={i}>
					<td>{type}</td>
					<td>{content}</td>
					<td>{time}</td>
				</tr>
			)
		}

		return rows;
	}

	render() {
		return (
			<table className='table table-bordered'>
				<tbody>
					<tr>
						<th>Type</th>
						<th>Content</th>
						<th>Time</th>
					</tr>
					{this.getLogs(this.props.logs)}
				</tbody>
			</table>
		)
	}
}

export default Logs;