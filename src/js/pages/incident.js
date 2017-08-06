import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Store from 'utils/store';
import Link from 'components/link';

class Incident extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.match.params.id,
			body: {},
			actions: []
		}
	}

	componentDidMount() {
		this.fetchIncidentInfo();
	}

	fetchIncidentInfo() {
		// get incident information from api
		Ajax.get(`${Globals.API_INCIDENTS}/${this.state.name}`, {
			'Authorization': Store.getItem('userToken')
		})
			.then(response => JSON.parse(response.response))
			.then(incident => {
				console.log(incident)
				this.setState(incident);
			})
			.catch(err => {
				console.log(err);
			})
	}

	handleAction(action) {

	}

	getActionClassName(action) {
		var className = 'incident-action btn ';
		
		switch (action) {
			case 'Approve':
				className += 'action-approve';
				break;
			case 'Reject':
				className += 'action-reject';
				break;
			default:
				className += 'btn-default';
		}

		return className;
	}

	render() {
		const status = this.state.status ? this.state.status.toLowerCase().replace('_','-') : '';
		return (
			<div>
				<Header />
				<Content offset>
					<div className='incident-wrap'>
						<div className='incident-info card col-sm-12'>
							<div className='incident-title'>
								<h1>Incident Overview</h1>
								<span className={`incident-status ${status}`}>
									{this.state.status}
								</span>
							</div>
							<p className='incident-name'>
								<strong>Name: </strong>
								{this.state.name}
							</p>
							<p className='incident-submitted'>
								<strong>Submitted: </strong>
								{Globals.formatDate(this.state.submitted)}
							</p>
							<p className='incident-type'>
								<strong>Type: </strong>
								{this.state.type}
							</p>
							{
								this.state.userId
									?
										<p className='incident-user'>
											<strong>Submitted by: </strong>
											<Link to={`/user/${this.state.userId}`}>
												{this.state.userId}
											</Link>
										</p>
									: ''
							}
						</div>
						<div className='incident-body col-md-6'>
							<div className='section'>
								<h1 className='section-heading'>Body</h1>
								<div className='card'>
									{
										Object.keys(this.state.body).length
											? Object.keys(this.state.body).map(item => 
												<p className='incident-body-item' key={item}>
													<strong>{`${item}: `}</strong>
													{this.state.body[item]}
												</p>
											)
											: <i>No body items</i>
									}
								</div>
							</div>
						</div>
						<div className='incident-actions col-md-6'>
							<div className='section'>
								<h1 className='section-heading'>Actions</h1>
								<div className='card'>
									{
										this.state.actions.length 
											? this.state.actions.map(action => 
												<div 
													key={action}
													className={this.getActionClassName(action)}
													onClick={this.handleAction.bind(this, action)}>
													{action}
												</div>
											)
											: <i>No actions.</i>
									}
								</div>
							</div>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Incident;