import React, {Component} from 'react';
import {Header, Content, Footer} from 'utils/layout';
import Globals from 'globals';
import Ajax from 'utils/ajax';
import Store from 'utils/store';

class Incident extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name: props.match.params.id
		}
	}

	componentDidMount() {
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

	render() {
		const status = this.state.status ? this.state.status.toLowerCase().replace('_','-') : '';
		return (
			<div>
				<Header />
				<Content offset>
					<div className='incident-wrap'>
						<div className='incident-info card col-sm-12'>
							<div className='incident-name'>
								<h1>{this.state.name}</h1>
								<span className={`incident-status ${status}`}>
									{this.state.status}
								</span>
							</div>
							<p className='incident-submitted'>
								<strong>Submitted: </strong>
								{Globals.getDate(this.state.submitted)}
							</p>
							<p className='incident-type'>
								<strong>Type: </strong>
								{this.state.type}
							</p>
						</div>
					</div>
				</Content>
				<Footer />
			</div>
		)
	}
}

export default Incident;