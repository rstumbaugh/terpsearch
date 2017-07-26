import React, {Component} from 'react';
import Ajax from 'utils/ajax';
import Auth from 'utils/auth';
import Store from 'utils/store';
import History from 'utils/history';
import Globals from 'globals';

class CommentInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			feedbackClass: 'slide closed',
			feedback: '',
			error: false,
			text: '',
			name: '',
			id: props.id
		};
	}

	handleChange(e) {
		this.setState({
			text: e.target.value
		})
	}

	handleSubmit() {
		var self = this;

		if (this.state.text.length < this.props.minLength) {
			this.setState({
				error: true,
				feedbackClass: 'error slide open',
				feedback: 'Comment must be at least ' + this.props.minLength + ' characters.'
			})
			return;
		}

		this.setState({
			error: false,
			feedbackClass: 'slide open',
			feedback: 'Submitting...',
			text: '',
			name: ''
		});

		var user = Auth.getCurrentUser();
		if (!user) {
			this.setState({
				feedbackClass: 'error slide open',
				feedback: 'You must be logged in to submit a comment.'
			})
			return;
		}
		var body = {
			comment: this.state.text,
			name: this.state.name || 'anonymous',
			userId: user ? user.providerData[0].uid : undefined
		}

		// send based on type passed from props
		body[`${this.props.type}Id`] = this.props.id;

		// handle UMD auth flow
		var redirectUrl = `${window.location.origin}/auth/redirect`;
		redirectUrl += `?type=comments&data=${encodeURIComponent(JSON.stringify(body))}`
		Ajax.post(this.props.url, {
			headers: {
				'Authorization': Store.getItem('userToken'),
				'X-Auth-Ticket': Store.getItem('authTicket'),
				'X-Auth-Service': redirectUrl.split('?')[0]
			},
			body: JSON.stringify(body)
		})
			.then(res => res.response)
			.then(response => {
				self.setState({
					feedbackClass: 'success slide open',
					feedback: response,
				})
			})
			.catch(err => {
				if (err.code == 401) {
					var href = window.location.pathname;
					var pageName = window.location.pathname.split('/')[1];
					pageName = pageName ? Globals.capitalize(pageName) : 'Home';
					History.push({href, pageName});
					History.push({href: 'noClear', pageName: ''});
					
					window.location.href = redirectUrl;
				}

				self.setState({
					feedbackClass: 'error slide open',
					feedback: err.response
				})
			})
	}

	render() {
		var self = this;
		var charsLeft = this.props.minLength - this.state.text.length;
		charsLeft = charsLeft > 0 ? charsLeft : 0;

		return (
			<div className='info-comment-input row'>
				<fieldset>
					<legend>Add a comment</legend>
					<div className={'col-md-12 form-group ' + (this.state.error ? 'has-error' : '')}>
						<label>{'Enter comment below (at least ' + this.props.minLength + ' characters):'}</label>
						<textarea 
							type='text' 
							value={this.state.text}
							rows={this.props.rows} 
							className={'form-control ' + this.props.className} 
							onChange={this.handleChange.bind(this)} />
						<p className='help-block'>
							{charsLeft + ' characters remaining.'}
						</p>
					</div>
					<div className='col-md-12 form-group'>
						<label>Enter name to display (leave blank for anonymous)</label>
						<input 
							className='form-control'
							type='text' 
							value={this.state.name}
							onChange={function(e) {self.setState({name: e.target.value})}}
							placeholder='anonymous'
						/>
					</div>
					<div className='info-comment-button-wrap col-md-3'>
						<div className='btn btn-primary' onClick={this.handleSubmit.bind(this)}>Submit</div>
					</div>
					<div className='info-comment-feedback-wrap col-md-6'>
						<p className={'form-feedback ' + this.state.feedbackClass}>
							{this.state.feedback}
						</p>
					</div>
				</fieldset>
			</div>
		)
	}
}

export default CommentInput;