import React, {Component} from 'react';
import Globals from 'globals';

class Incidents extends Component {
	getIncidents(incidents) {
		var rows = [];

		incidents.forEach(item => {
			var time = Globals.formatDate(item.submitted);
			rows.push(
				<tr key={item.name}>
					<td>
						<a href={`/admin/incident/${item.name}`}>
							{item.name}
						</a>
					</td>
					<td>{item.type}</td>
					<td>{time}</td>
				</tr>
			)
		})

		return rows;
	}

	getTable(incidentType, incidents) {
		return (
			<div>
				<h3>{incidentType}</h3>
				<table className='table table-bordered'>
					<tbody>
						<tr>
							<th>Feedback</th>
							<th>Type</th>
							<th>Time</th>
						</tr>
						{this.getIncidents(incidents)}
					</tbody>
				</table>
				<br/>
			</div>
		)
	}

	render() {
		const {NEW, IN_PROGRESS, RESOLVED} = this.props.incidents;
		
		return (
			<div className='incidents'>
				{ this.getTable('New', NEW) }
				{ this.getTable('In Progess', IN_PROGRESS) }
				{ this.getTable('Resolved', RESOLVED) }
			</div>
		)
	}
}

export default Incidents;